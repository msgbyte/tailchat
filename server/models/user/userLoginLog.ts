import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  modelOptions,
  Severity,
  index,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';
import { User } from './user';

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
  schemaOptions: {
    collection: 'user_login_logs',
  },
})
@index({ userId: 1, createdAt: -1 })
@index({ ip: 1, createdAt: -1 })
export class UserLoginLog extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  /**
   * 登录用户
   */
  @prop({ ref: () => User, required: true })
  userId: Ref<User>;

  /**
   * 登录IP
   */
  @prop({
    required: true,
  })
  ip: string;

  /**
   * 登录 User-Agent
   */
  @prop()
  userAgent?: string;
}

export type UserLoginLogDocument = DocumentType<UserLoginLog>;

const model = getModelForClass(UserLoginLog);

export type UserLoginLogModel = typeof model;

export default model;
