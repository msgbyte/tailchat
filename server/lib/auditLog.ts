import type { ServiceSchema } from 'moleculer';
import type { PureContext, TcContext } from 'tailchat-server-sdk';
import auditLogModel from '../models/auditLog';

type AuditedContext = TcContext<
  { groupId?: string },
  { ip?: string; userAgent?: string }
>;

/**
 * 补充审计明细, 用于记录 action 参数里拿不到的信息(如被删除的内容、所属群组)
 */
export function setAuditDetail(
  ctx: PureContext,
  detail: Record<string, unknown>
) {
  ctx.locals.audit = detail;
}

/**
 * 生成审计日志 mixin, 列出的 action 执行成功后会写入一条审计日志
 *
 * 没有操作人的内部调用不记录(如 joinGroup 内部的 addMember), 由外层 action 负责记录
 */
export function auditLogMixin(actionNames: string[]): Partial<ServiceSchema> {
  const record = async (ctx: AuditedContext, res: unknown) => {
    const { userId, user, ip, userAgent } = ctx.meta;
    if (userId) {
      // 以其他身份代为调用时(如管理员把机器人加入群组), 操作人记为实际登录的用户
      const operator = String(user?._id ?? userId);

      await auditLogModel.record({
        source: 'group',
        action: ctx.action.name,
        operator,
        groupId: ctx.params.groupId ?? ctx.locals.audit?.groupId,
        detail: {
          ...ctx.params,
          ...ctx.locals.audit,
          ...(operator !== String(userId) && { asUser: String(userId) }),
        },
        ip,
        userAgent,
      });
    }

    return res;
  };

  return {
    hooks: {
      after: Object.fromEntries(actionNames.map((name) => [name, record])),
    },
  };
}
