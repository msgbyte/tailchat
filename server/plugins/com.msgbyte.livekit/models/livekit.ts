import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_livekit',
  },
})
export class Livekit extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;
}

export type LivekitDocument = db.DocumentType<Livekit>;

const model = getModelForClass(Livekit);

export type LivekitModel = typeof model;

export default model;
