import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_fim',
  },
})
export class Fim extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;
}

export type FimDocument = db.DocumentType<Fim>;

const model = getModelForClass(Fim);

export type FimModel = typeof model;

export default model;
