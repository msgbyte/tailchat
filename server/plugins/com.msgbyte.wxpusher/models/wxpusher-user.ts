import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_wxpusher_user',
  },
})
export class WXPusherUser extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;

  @prop()
  userId: string;

  @prop()
  wxpusherUserId: string;
}

export type WXPusherUserDocument = db.DocumentType<WXPusherUser>;

const model = getModelForClass(WXPusherUser);

export type WXPusherUserModel = typeof model;

export default model;
