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
    customName: 'p_githubRepo',
  },
})
export class Repo extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    unique: true,
  })
  repoName: string; // 完整地址

  @prop()
  groupId: string;
}

export type RepoDocument = DocumentType<Repo>;

const model = getModelForClass(Repo);

export type RepoModel = typeof model;

export default model;
