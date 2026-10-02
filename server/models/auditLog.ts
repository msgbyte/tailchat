import {
  getModelForClass,
  prop,
  DocumentType,
  modelOptions,
  Severity,
  index,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';

const SENSITIVE_KEY = /pass|token|secret/i;
const MAX_STRING_LENGTH = 512;
const MAX_ITEMS = 50;
const MAX_DEPTH = 5;
const MAX_DETAIL_LENGTH = 8192;

function sanitizeValue(value: unknown, depth: number): unknown {
  if (typeof value === 'string') {
    return value.length > MAX_STRING_LENGTH
      ? `${value.slice(0, MAX_STRING_LENGTH)}…`
      : value;
  }
  if (value === null || typeof value !== 'object') {
    return typeof value === 'function' ? undefined : value;
  }
  if (depth >= MAX_DEPTH) {
    return '[Truncated]';
  }
  if (Array.isArray(value)) {
    return value
      .slice(0, MAX_ITEMS)
      .map((item) => sanitizeValue(item, depth + 1));
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) {
    // Date, ObjectId, Stream 等非纯对象
    return value instanceof Date ? value : String(value);
  }

  return Object.fromEntries(
    Object.entries(value)
      .slice(0, MAX_ITEMS)
      .map(([key, item]) => [
        key.replace(/^\$|\./g, '_'), // mongo 不接受 $ 开头或带 . 的键名
        SENSITIVE_KEY.test(key) ? '[REDACTED]' : sanitizeValue(item, depth + 1),
      ])
  );
}

/**
 * 清洗审计明细: 脱敏敏感字段, 转义键名, 并限制写入体积
 */
export function sanitizeAuditDetail(detail: unknown): unknown {
  const sanitized = sanitizeValue(detail, 0);
  const json = JSON.stringify(sanitized) ?? '';

  return json.length > MAX_DETAIL_LENGTH
    ? { truncated: json.slice(0, MAX_DETAIL_LENGTH) }
    : sanitized;
}

export interface AuditLogEntry {
  source: 'admin' | 'group';
  action: string;
  operator: string;
  groupId?: string;
  success?: boolean;
  detail?: unknown;
  ip?: string;
  userAgent?: string;
}

/**
 * 审计日志
 * 只追加, 不提供修改和删除入口
 */
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    collection: 'audit_logs',
  },
})
@index({ createdAt: -1 })
@index({ operator: 1, createdAt: -1 })
@index({ groupId: 1, createdAt: -1 })
export class AuditLog extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  /**
   * 操作来源
   * admin: 管理后台, group: 群组管理操作
   */
  @prop({ required: true })
  source: string;

  /**
   * 操作名
   * 管理后台为 `<METHOD> <路径>`, 群组操作为完整的 action 名
   */
  @prop({ required: true })
  action: string;

  /**
   * 操作人
   * 管理后台为后台账号, 群组操作为用户id
   */
  @prop({ required: true })
  operator: string;

  /**
   * 操作所属群组
   */
  @prop()
  groupId?: string;

  @prop({ default: true })
  success: boolean;

  /**
   * 操作参数(已脱敏)
   */
  @prop()
  detail?: any;

  @prop()
  ip?: string;

  @prop()
  userAgent?: string;

  /**
   * 写入一条审计日志
   *
   * Fail open: 写入失败只输出错误不抛出, 审计存储故障不会阻塞管理操作
   * 数据库未连接时直接放弃, 不等待 mongoose 的命令缓冲超时
   */
  static async record(
    this: ReturnModelType<typeof AuditLog>,
    entry: AuditLogEntry
  ): Promise<void> {
    try {
      if (this.db.readyState === 0) {
        throw new Error('mongo is not connected');
      }

      await this.create({
        ...entry,
        detail: sanitizeAuditDetail(entry.detail),
      });
    } catch (err) {
      console.error('[AuditLog] record failed:', entry.action, err);
    }
  }
}

export type AuditLogDocument = DocumentType<AuditLog>;

const model = getModelForClass(AuditLog);

export type AuditLogModel = typeof model;

export default model;
