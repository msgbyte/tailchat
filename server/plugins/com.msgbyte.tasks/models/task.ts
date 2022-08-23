import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  modelOptions,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';
import { User } from '../../../models/user/user';

@modelOptions({
  options: {
    customName: 'p_tasks',
  },
})
export class Task extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  /**
   * 创建者
   */
  @prop({
    ref: () => User,
    index: true,
  })
  creator: Ref<User>;

  /**
   * 指定人
   */
  @prop({
    ref: () => User,
    index: true,
  })
  assignee?: Ref<User>[];

  /**
   * 标题
   */
  @prop()
  title: string;

  /**
   * 描述
   */
  @prop()
  description?: string;

  /**
   * 已完成
   */
  @prop({
    default: false,
  })
  done: boolean;

  /**
   * 过期时间
   */
  @prop()
  expiredAt?: Date;

  // TODO: 增加消息提醒
}

export type TaskDocument = DocumentType<Task>;

const model = getModelForClass(Task);

export type TaskModel = typeof model;

export default model;
