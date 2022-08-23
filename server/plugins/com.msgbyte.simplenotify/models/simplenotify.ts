import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_simplenotify',
  },
})
export class SimpleNotify extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;

  @prop({
    default: 'group',
  })
  type: 'user' | 'group';

  // 群组
  @prop()
  groupId?: string;

  @prop()
  textPanelId?: string;

  // 个人
  @prop()
  userConverseId?: string;

  get converseId(): string {
    if (this.type === 'user') {
      return this.userConverseId;
    }

    return this.textPanelId;
  }
}

export type SimpleNotifyDocument = db.DocumentType<SimpleNotify>;

const model = getModelForClass(SimpleNotify);

export type SimpleNotifyModel = typeof model;

export default model;
