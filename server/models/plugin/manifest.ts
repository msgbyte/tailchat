import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  ReturnModelType,
  modelOptions,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';
import { User } from '../user/user';

export class PluginManifest extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop()
  label: string;

  @prop({
    unique: true,
  })
  name: string;

  /**
   * 插件入口地址
   */
  @prop()
  url: string;

  @prop()
  icon?: string;

  @prop()
  version: string;

  @prop()
  author: string;

  @prop()
  description: string;

  @prop()
  requireRestart: string;

  @prop({ ref: () => User })
  uploader?: Ref<User>;
}

export type PluginManifestDocument = DocumentType<PluginManifest>;

const model = getModelForClass(PluginManifest);

export type PluginManifestModel = typeof model;

export default model;
