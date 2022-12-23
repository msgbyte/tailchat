import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_agora',
  },
})
export class Agora extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;
}

export type AgoraDocument = db.DocumentType<Agora>;

const model = getModelForClass(Agora);

export type AgoraModel = typeof model;

export default model;
