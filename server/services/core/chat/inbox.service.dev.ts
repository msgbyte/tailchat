import type { InboxDocument, InboxModel } from '../../../models/chat/inbox';
import {
  TcService,
  TcContext,
  TcDbService,
  TcPureContext,
} from 'tailchat-server-sdk';

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

    this.registerEventListener(
      'chat.message.updateMessage',
      async (payload, ctx) => {
        if (
          Array.isArray(payload.meta.mentions) &&
          payload.meta.mentions.length > 0
        ) {
          const mentions = payload.meta.mentions;
          if (payload.type === 'add') {
            await Promise.all(
              mentions.map((userId) => {
                return ctx.call('chat.inbox.appendMessage', {
                  userId,
                  groupId: payload.groupId,
                  converseId: payload.converseId,
                  messageId: payload.messageId,
                  messageSnippet: payload.content,
                });
              })
            );
          } else if (payload.type === 'delete') {
            await Promise.all(
              mentions.map((userId) => {
                return ctx.call('chat.inbox.removeMessage', {
                  userId,
                  groupId: payload.groupId,
                  converseId: payload.converseId,
                  messageId: payload.messageId,
                });
              })
            );
          }

          this.notifyUsersInboxUpdate(ctx, mentions);
        }
      }
    );

    this.registerAction('appendMessage', this.appendMessage, {
      visibility: 'public',
      params: {
        userId: { type: 'string', optional: true },
        groupId: { type: 'string', optional: true },
        converseId: 'string',
        messageId: 'string',
        messageSnippet: 'string',
      },
    });
    this.registerAction('removeMessage', this.removeMessage, {
      visibility: 'public',
      params: {
        userId: { type: 'string', optional: true },
        groupId: { type: 'string', optional: true },
        converseId: 'string',
        messageId: 'string',
      },
    });
    this.registerAction('all', this.all);
    this.registerAction('ack', this.ack, {
      params: {
        inboxItemId: 'string',
      },
    });
  }

  async appendMessage(
    ctx: TcContext<{
      userId?: string;
      groupId?: string;
      converseId: string;
      messageId: string;
      messageSnippet: string;
    }>
  ) {
    const {
      userId = ctx.meta.userId,
      groupId,
      converseId,
      messageId,
      messageSnippet,
    } = ctx.params;

    await this.adapter.model.create({
      userId,
      type: 'message',
      message: {
        groupId,
        converseId,
        messageId,
        messageSnippet,
      },
    });

    return true;
  }

  async removeMessage(
    ctx: TcContext<{
      userId?: string;
      groupId?: string;
      converseId: string;
      messageId: string;
    }>
  ) {
    const {
      userId = ctx.meta.userId,
      groupId,
      converseId,
      messageId,
    } = ctx.params;

    await this.adapter.model.remove({
      userId,
      type: 'message',
      message: {
        groupId,
        converseId,
        messageId,
      },
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

  /**
   * 标记收件箱内容已读
   */
  async ack(ctx: TcContext<{ inboxItemId: string }>) {
    const inboxItemId = ctx.params.inboxItemId;
    const userId = ctx.meta.userId;

    await this.adapter.model.updateOne(
      {
        _id: inboxItemId,
        userId,
      },
      {
        readed: true,
      }
    );

    return true;
  }

  /**
   * 发送通知群组信息发生变更
   *
   * 发送通知时会同时清空群组信息缓存
   */
  private async notifyUsersInboxUpdate(
    ctx: TcPureContext,
    userIds: string[]
  ): Promise<void> {
    await this.listcastNotify(ctx, userIds, 'updated', {});
  }
}

export default InboxService;
