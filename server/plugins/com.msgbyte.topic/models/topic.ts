import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, TimeStamps, modelOptions } = db;
import type { Types } from 'mongoose';
import { nanoid } from 'nanoid';

class GroupTopicComment extends TimeStamps {
  @prop({
    default: () => nanoid(8),
  })
  id: string;

  @prop()
  content: string;

  @prop()
  author: string;

  /**
   * 回复他人评论的id
   */
  @prop()
  replyCommentId?: string;
}

@modelOptions({
  options: {
    customName: 'p_topic',
  },
})
export class GroupTopic extends TimeStamps implements db.Base {
  _id: Types.ObjectId;
  id: string;

  @prop()
  content: string;

  @prop()
  author: string;

  @prop()
  groupId: string;

  /**
   * 会话面板id
   */
  @prop()
  panelId: string;

  @prop({
    type: () => GroupTopicComment,
    default: [],
  })
  comments: GroupTopicComment[];
}

export type GroupTopicDocument = db.DocumentType<GroupTopic>;

const model = getModelForClass(GroupTopic);

export type GroupTopicModel = typeof model;

export default model;
