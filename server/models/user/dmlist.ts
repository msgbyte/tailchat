import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  modelOptions,
} from '@typegoose/typegoose';
import { Base, FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses';
import { Converse } from '../chat/converse';
import { User } from './user';
import findorcreate from 'mongoose-findorcreate';
import { plugin } from '@typegoose/typegoose';
import type { Types } from 'mongoose';

/**
 * 用户私信列表管理
 */

@plugin(findorcreate)
@modelOptions({
  schemaOptions: {
    collection: 'userdmlist',
  },
})
export class UserDMList extends FindOrCreate implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    ref: () => User,
    index: true,
  })
  userId: Ref<User>;

  @prop({
    ref: () => Converse,
  })
  converseIds: Ref<Converse>[];
}

export type UserDMListDocument = DocumentType<UserDMList>;

const model = getModelForClass(UserDMList);

export type UserDMListModel = typeof model;

export default model;
