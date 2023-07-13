import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import moment from 'moment';
import type { Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { User } from '../user/user';
import { Group } from './group';

function generateCode() {
  return nanoid(8);
}

export class GroupInvite extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    index: true,
    unique: true,
    default: () => generateCode(),
  })
  code!: string;

  @prop({
    ref: () => User,
  })
  creator: Ref<User>;

  @prop({
    ref: () => Group,
  })
  groupId!: Ref<Group>;

  /**
   * 过期时间，如果不存在则永不过期
   */
  @prop()
  expiredAt?: Date;

  /**
   * 被使用次数
   */
  @prop({
    default: 0,
  })
  usage: number;

  /**
   * 使用上限，如果为空则不限制
   */
  @prop()
  usageLimit?: number;

  /**
   * 创建群组邀请
   * @param groupId 群组id
   * @param type 普通(7天) 永久
   */
  static async createGroupInvite(
    this: ReturnModelType<typeof GroupInvite>,
    groupId: string,
    creator: string,
    inviteType: 'normal' | 'permanent'
  ): Promise<GroupInviteDocument> {
    let expiredAt = moment().add(7, 'day').toDate(); // 默认7天
    if (inviteType === 'permanent') {
      expiredAt = undefined;
    }

    const invite = await this.create({
      groupId,
      code: generateCode(),
      creator,
      expiredAt,
    });

    return invite;
  }
}

export type GroupInviteDocument = DocumentType<GroupInvite>;

const model = getModelForClass(GroupInvite);

export type GroupInviteModel = typeof model;

export default model;
