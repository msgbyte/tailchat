import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  modelOptions,
  Severity,
  index,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import type { Types } from 'mongoose';

/**
 * Group Extra Data
 * Use to storage large data when panel load or others
 */
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@index({ groupId: 1, panelId: 1, name: 1 })
export class GroupExtra extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    ref: () => GroupExtra,
  })
  groupId: Ref<GroupExtra>;

  @prop()
  panelId?: string;

  @prop()
  name: string;

  /**
   * Only allow string
   */
  @prop()
  data: string;
}

export type GroupExtraDocument = DocumentType<GroupExtra>;

const model = getModelForClass(GroupExtra);

export type GroupExtraModel = typeof model;

export default model;
