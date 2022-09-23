import {
  getModelForClass,
  DocumentType,
  Ref,
  prop,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { User } from '../user/user';
import { Group } from './group';

class GroupTopicComment {
  @prop({
    default: () => nanoid(8),
  })
  id: string;

  @prop()
  content: string;

  @prop({ ref: () => User })
  author: Ref<User>;

  /**
   * 回复他人评论的id
   */
  @prop()
  replyCommentId?: string;
}

export class GroupTopic extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop()
  content: string;

  @prop({ ref: () => User })
  author: Ref<User>;

  @prop({ ref: () => Group })
  groupId: Ref<Group>;

  /**
   * 会话面板id
   */
  @prop()
  panelId: string;

  @prop({
    type: () => GroupTopicComment,
    default: [],
  })
  comment: GroupTopicComment[];
}

export type GroupTopicDocument = DocumentType<GroupTopic>;

const model = getModelForClass(GroupTopic);

export type GroupTopicModel = typeof model;

export default model;
