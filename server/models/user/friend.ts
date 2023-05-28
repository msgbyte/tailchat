import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  plugin,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Base, FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from './user';
import findorcreate from 'mongoose-findorcreate';
import type { Types } from 'mongoose';

/**
 * 好友请求
 * 单向好友结构
 */
@plugin(findorcreate)
export class Friend extends FindOrCreate implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    ref: () => User,
    index: true,
  })
  from: Ref<User>;

  @prop({
    ref: () => User,
  })
  to: Ref<User>;

  /**
   * 好友昵称, 覆盖用户自己的昵称
   */
  @prop()
  nickname?: string;

  @prop()
  createdAt: Date;

  static async buildFriendRelation(
    this: ReturnModelType<FriendModel>,
    user1: string,
    user2: string
  ) {
    await Promise.all([
      this.findOrCreate({
        from: user1,
        to: user2,
      }),
      this.findOrCreate({
        from: user2,
        to: user1,
      }),
    ]);
  }
}

export type FriendDocument = DocumentType<Friend>;

const model = getModelForClass(Friend);

export type FriendModel = typeof model;

export default model;
