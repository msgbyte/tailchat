import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  index,
} from '@typegoose/typegoose';
import type { Base } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';
import { User } from '../user/user';
import { Converse } from './converse';
import { Message } from './message';

/**
 * 消息已读管理
 */
@index({ userId: 1, converseId: 1 }, { unique: true }) // 一组userId和converseId应当唯一(用户为先)
export class Ack implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    ref: () => User,
  })
  userId: Ref<User>;

  @prop({
    ref: () => Converse,
  })
  converseId: Ref<Converse>;

  @prop({
    ref: () => Message,
  })
  lastMessageId: Ref<Message>;
}

export type AckDocument = DocumentType<Ack>;

const model = getModelForClass(Ack);

export type AckModel = typeof model;

export default model;
