import { Types } from 'mongoose';
import type { InboxDocument, InboxModel } from '../../../models/chat/inbox';
import { TcService, TcContext, TcDbService } from 'tailchat-server-sdk';

/**
 * 收件箱管理
 */
interface InboxService
  extends TcService,
    TcDbService<InboxDocument, InboxModel> {}
class InboxService extends TcService {
  get serviceName(): string {
    return 'chat.inbox';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/chat/inbox').default);

    this.registerEventListener('chat.message.updateMessage', (payload) => {
      // TODO
    });

    this.registerAction('append', this.append, {
      visibility: 'public',
      params: {
        userId: { type: 'string', optional: true },
        messageId: 'string',
        messageSnippet: 'string',
      },
    });
    this.registerAction('all', this.all);
  }

  async append(
    ctx: TcContext<{
      userId?: string;
      messageId: string;
      messageSnippet: string;
    }>
  ) {
    const { userId = ctx.meta.userId, messageId, messageSnippet } = ctx.params;

    await this.adapter.model.create({
      userId,
      messageId,
      messageSnippet,
    });

    return true;
  }

  /**
   * 获取用户收件箱中所有内容
   */
  async all(ctx: TcContext<{}>) {
    const userId = ctx.meta.userId;

    const list = await this.adapter.model.find({
      userId,
    });

    return await this.transformDocuments(ctx, {}, list);
  }
}

export default InboxService;
