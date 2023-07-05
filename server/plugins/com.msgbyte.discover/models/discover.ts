import { db } from 'tailchat-server-sdk';
import { Group } from '../../../models/group/group';
const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_discover',
  },
})
export class Discover extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;

  @prop({ ref: () => Group })
  groupId: db.Ref<Group>;

  @prop({ default: true })
  active: boolean;

  @prop({ default: 0 })
  order: number;
}

export type DiscoverDocument = db.DocumentType<Discover>;

const model = getModelForClass(Discover);

export type DiscoverModel = typeof model;

export default model;
