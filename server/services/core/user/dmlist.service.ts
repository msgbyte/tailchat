import type { Ref } from '@typegoose/typegoose';
import type { Converse } from '../../../models/chat/converse';
import type {
  UserDMList,
  UserDMListDocument,
  UserDMListModel,
} from '../../../models/user/dmlist';
import { TcService, TcContext, TcDbService, db } from 'tailchat-server-sdk';

interface UserDMListService
  extends TcService,
    TcDbService<UserDMListDocument, UserDMListModel> {}
class UserDMListService extends TcService {
  get serviceName(): string {
    return 'user.dmlist';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/user/dmlist').default);
    this.registerAction('addConverse', this.addConverse, {
      params: {
        converseId: 'string',
      },
    });
    this.registerAction('removeConverse', this.removeConverse, {
      params: {
        converseId: 'string',
      },
    });
    this.registerAction('getAllConverse', this.getAllConverse);
  }

  async addConverse(ctx: TcContext<{ converseId: string }>) {
    const userId = ctx.meta.userId;
    const converseId = ctx.params.converseId;

    const record = await this.adapter.model.findOrCreate({
      userId,
    });

    const res = await this.adapter.model.findByIdAndUpdate(record.doc._id, {
      $addToSet: {
        converseIds: new db.Types.ObjectId(converseId),
      },
    });

    return await this.transformDocuments(ctx, {}, res);
  }

  /**
   * 移除会话
   */
  async removeConverse(ctx: TcContext<{ converseId: string }>) {
    const userId = ctx.meta.userId;
    const converseId = ctx.params.converseId;

    const { modifiedCount } = await this.adapter.model
      .updateOne(
        {
          userId,
        },
        {
          $pull: {
            converseIds: converseId,
          },
        }
      )
      .exec();

    return { modifiedCount };
  }

  /**
   * 获取所有会话
   */
  async getAllConverse(ctx: TcContext): Promise<Ref<Converse>[]> {
    const userId = ctx.meta.userId;

    const doc = await this.adapter.model.findOne({
      userId,
    });

    const res: UserDMList | null = await this.transformDocuments(ctx, {}, doc);

    return res?.converseIds ?? [];
  }
}

export default UserDMListService;
