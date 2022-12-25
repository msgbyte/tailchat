import { db } from 'tailchat-server-sdk';
const { getModelForClass, prop, modelOptions, TimeStamps } = db;

@modelOptions({
  options: {
    customName: 'p_agora_meeting',
  },
})
export class AgoraMeeting extends TimeStamps implements db.Base {
  _id: db.Types.ObjectId;
  id: string;

  @prop()
  converseId: string;

  @prop()
  channelName: string;

  @prop()
  active: boolean;

  /**
   * 参会人
   */
  @prop({
    default: [],
  })
  members: string[];

  /**
   * 结束时间
   */
  @prop()
  endAt?: Date;

  static async findLastestMeetingByConverseId(
    this: db.ReturnModelType<typeof AgoraMeeting>,
    converseId: string
  ) {
    return this.findOne({
      converseId,
      active: true,
    }).sort({
      _id: -1,
    });
  }
}

export type AgoraMeetingDocument = db.DocumentType<AgoraMeeting>;

const model = getModelForClass(AgoraMeeting);

export type AgoraMeetingModel = typeof model;

export default model;
