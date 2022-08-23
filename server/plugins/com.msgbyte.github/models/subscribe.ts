import {
  getModelForClass,
  prop,
  DocumentType,
  modelOptions,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';

@modelOptions({
  options: {
    customName: 'p_githubSubscribe',
  },
})
export class Subscribe extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop()
  groupId: string;

  @prop()
  textPanelId: string;

  @prop()
  repoName: string;
}

export type SubscribeDocument = DocumentType<Subscribe>;

const model = getModelForClass(Subscribe);

export type SubscribeModel = typeof model;

export default model;
