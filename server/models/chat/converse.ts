import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Types } from 'mongoose';
import { NAME_REGEXP } from '../../lib/const';
import { User } from '../user/user';

/**
 * 设计参考: https://discord.com/developers/docs/resources/channel
 */

const converseType = [
  'DM', // 私信
  'Multi', // 多人会话
  'Group', // 群组
] as const;

/**
 * 聊天会话
 */
export class Converse extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    trim: true,
    match: NAME_REGEXP,
  })
  name?: string;

  /**
   * 会话类型
   */
  @prop({
    enum: converseType,
    type: () => String,
  })
  type!: (typeof converseType)[number];

  /**
   * 会话参与者
   * DM会话与多人会话有值
   */
  @prop({ ref: () => User })
  members?: Ref<User>[];

  /**
   * 查找固定成员已存在的会话
   */
  static async findConverseWithMembers(
    this: ReturnModelType<typeof Converse>,
    members: string[]
  ): Promise<DocumentType<Converse> | null> {
    const converse = await this.findOne({
      members: {
        $all: [...members],
        $size: members.length,
      },
    });

    return converse;
  }

  /**
   * 获取用户所有加入的会话
   */
  static async findAllJoinedConverseId(
    this: ReturnModelType<typeof Converse>,
    userId: string
  ): Promise<string[]> {
    const conserves = await this.find(
      {
        members: new Types.ObjectId(userId),
      },
      {
        _id: 1,
      }
    );

    return conserves
      .map((c) => c.id)
      .filter(Boolean)
      .map(String);
  }
}

export type ConverseDocument = DocumentType<Converse>;

const model = getModelForClass(Converse);

export type ConverseModel = typeof model;

export default model;
