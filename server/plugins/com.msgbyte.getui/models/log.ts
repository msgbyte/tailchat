import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_getui_log',
  },
})
export class GetuiLog extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;
}

export type GetuiLogDocument = db.DocumentType<GetuiLog>;

const model = getModelForClass(GetuiLog);

export type GetuiLogModel = typeof model;

export default model;
