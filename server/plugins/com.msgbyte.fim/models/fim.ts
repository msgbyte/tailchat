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

  /**
   * 账号供应商
   * 如 Github
   */
  @prop()
  provider: string;

  /**
   * 在账号供应商那边的唯一标识
   * 根据不同的供应商有不同的格式
   */
  @prop()
  providerId: string;

  @prop()
  userId: string;
}

export type FimDocument = db.DocumentType<Fim>;

const model = getModelForClass(Fim);

export type FimModel = typeof model;

export default model;
