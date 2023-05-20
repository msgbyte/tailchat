import { Model, Document } from 'mongoose';

export interface ADPBaseSchema {
  _id: string;
}

export type ADPBaseModel = Model<ADPBaseSchema & Document & any>;
