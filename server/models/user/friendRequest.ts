import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
} from '@typegoose/typegoose';
import type { Base } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';
import { User } from './user';

/**
 * 好友请求
 */

export class FriendRequest implements Base {
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

  @prop()
  message: string;
}

export type FriendRequestDocument = DocumentType<FriendRequest>;

export default getModelForClass(FriendRequest);
