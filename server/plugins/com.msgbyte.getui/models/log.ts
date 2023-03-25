import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, modelOptions, TimeStamps, Severity } = db;

@modelOptions({
  options: {
    customName: 'p_getui_log',
    allowMixed: Severity.ALLOW,
  },
})
export class GetuiLog extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;

  @prop()
  userId: string;

  @prop()
  title: string;

  @prop()
  content: string;

  @prop()
  payload: object;

  @prop()
  success: boolean;

  @prop()
  errorMsg?: string;
}

export type GetuiLogDocument = db.DocumentType<GetuiLog>;

const model = getModelForClass(GetuiLog);

export type GetuiLogModel = typeof model;

export default model;
