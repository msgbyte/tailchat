import { db } from 'tailchat-server-sdk';
const { getModelForClass, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_meeting',
  },
})
export class Meeting extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;
}

export type MeetingDocument = db.DocumentType<Meeting>;

const model = getModelForClass(Meeting);

export type MeetingModel = typeof model;

export default model;
