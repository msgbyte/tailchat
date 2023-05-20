import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  ReturnModelType,
  modelOptions,
  Severity,
  index,
} from '@typegoose/typegoose';
import { Group } from '../group/group';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Converse } from './converse';
import { User } from '../user/user';
import type { FilterQuery, Types } from 'mongoose';
import type { MessageMetaStruct } from 'tailchat-server-sdk';

class MessageReaction {
  /**
   * 消息反应名
   * 可以直接为emoji表情
   */
  @prop()
  name: string;

  @prop({ ref: () => User })
  author?: Ref<User>;
}

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@index({ createdAt: -1 })
export class Message extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop()
  content: string;

  @prop({ ref: () => User })
  author?: Ref<User>;

  @prop({ ref: () => Group })
  groupId?: Ref<Group>;

  /**
   * 会话ID 必填
   * 私信的本质就是创建一个双人的会话
   */
  @prop({ ref: () => Converse, index: true })
  converseId!: Ref<Converse>;

  @prop({ type: () => MessageReaction })
  reactions?: MessageReaction[];

  /**
   * 是否已撤回
   */
  @prop({
    default: false,
  })
  hasRecall: boolean;

  /**
   * 消息的其他数据
   */
  @prop()
  meta?: MessageMetaStruct;

  /**
   * 获取会话消息
   */
  static async fetchConverseMessage(
    this: ReturnModelType<typeof Message>,
    converseId: string,
    startId: string | null,
    limit = 50
  ) {
    const conditions: FilterQuery<DocumentType<Message>> = {
      converseId,
    };
    if (startId !== null) {
      conditions['_id'] = {
        $lt: startId,
      };
    }

    const res = await this.find({ ...conditions })
      .sort({ _id: -1 })
      .limit(limit)
      .exec();

    return res;
  }
}

export type MessageDocument = DocumentType<Message>;

const model = getModelForClass(Message);

export type MessageModel = typeof model;

export default model;
