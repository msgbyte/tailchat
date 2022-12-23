import { Types } from 'mongoose';
import type { AckDocument, AckModel } from '../../../models/chat/ack';
import { TcService, TcContext, TcDbService } from 'tailchat-server-sdk';

/**
 * 消息已读管理
 */

interface AckService extends TcService, TcDbService<AckDocument, AckModel> {}
class AckService extends TcService {
  get serviceName(): string {
    return 'chat.ack';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/chat/ack').default);
    // Public fields
    this.registerDbField(['userId', 'converseId', 'lastMessageId']);

    this.registerAction('update', this.updateAck, {
      params: {
        converseId: 'string',
        lastMessageId: 'string',
      },
    });
    this.registerAction('all', this.allAck);
  }

  /**
   * 更新用户在会话中已读的最后一条消息
   */
  async updateAck(
    ctx: TcContext<{
      converseId: string;
      lastMessageId: string;
    }>
  ) {
    const { converseId, lastMessageId } = ctx.params;
    const userId = ctx.meta.userId;

    await this.adapter.model.findOneAndUpdate(
      {
        converseId,
        userId,
      },
      {
        lastMessageId: new Types.ObjectId(lastMessageId),
      },
      {
        upsert: true,
      }
    );

    // TODO: 如果要实现消息已读可以在此处基于会话id进行通知
  }

  /**
   * 所有的ack信息
   */
  async allAck(ctx: TcContext) {
    const userId = ctx.meta.userId;

    const list = await this.adapter.model.find({
      userId,
    });

    return await this.transformDocuments(ctx, {}, list);
  }
}

export default AckService;
