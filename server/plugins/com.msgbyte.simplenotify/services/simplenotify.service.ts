import {
  TcService,
  TcDbService,
  TcContext,
  TcPureContext,
  call,
  NoPermissionError,
} from 'tailchat-server-sdk';
import type {
  SimpleNotifyDocument,
  SimpleNotifyModel,
} from '../models/simplenotify';

const PERMISSION_MANAGE = 'plugin.com.msgbyte.simplenotify.subscribe.manage';

/**
 * 任务管理服务
 */
interface SimpleNotifyService
  extends TcService,
    TcDbService<SimpleNotifyDocument, SimpleNotifyModel> {}
class SimpleNotifyService extends TcService {
  botUserId: string | undefined;

  get serviceName() {
    return 'plugin:com.msgbyte.simplenotify';
  }

  onInit() {
    this.registerLocalDb(require('../models/simplenotify').default);

    this.registerAction('addGroupSubscribe', this.addGroupSubscribe, {
      params: {
        groupId: 'string',
        textPanelId: 'string',
      },
    });
    this.registerAction('addUserSubscribe', this.addUserSubscribe);
    this.registerAction('list', this.list, {
      params: {
        groupId: 'string',
        type: {
          type: 'enum',
          values: ['user', 'group'],
        },
      },
    });
    this.registerAction('delete', this.delete, {
      params: {
        groupId: 'string',
        subscribeId: 'string',
      },
    });
    this.registerAction('webhook.callback', this.webhookHandler, {
      params: {
        subscribeId: 'string',
        text: 'string',
      },
    });

    this.registerAuthWhitelist(['/webhook/callback']);
  }

  protected onInited(): void {
    // 确保机器人用户存在, 并记录机器人用户id
    this.waitForServices(['user']).then(async () => {
      try {
        const botUserId = await this.broker.call('user.ensurePluginBot', {
          botId: 'simple-notify-bot',
          nickname: 'Notify Bot',
          avatar: '/images/avatar/robot.webp',
        });

        this.logger.info('Simple Notify Bot Id:', botUserId);

        this.botUserId = String(botUserId);
      } catch (e) {
        this.logger.error(e);
      }
    });
  }

  /**
   * 添加群组订阅
   */
  async addGroupSubscribe(
    ctx: TcContext<{
      groupId: string;
      textPanelId: string;
    }>
  ) {
    const { groupId, textPanelId } = ctx.params;
    const { userId, t } = ctx.meta;

    if (!groupId || !textPanelId) {
      throw new Error('参数不全');
    }

    const [hasPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION_MANAGE]
    );
    if (!hasPermission) {
      throw new NoPermissionError(t('没有操作权限'));
    }

    // TODO: 需要检查textPanelId是否合法

    await this.adapter.model.create({
      groupId,
      textPanelId,
      type: 'group',
    });
  }

  /**
   * 添加个人订阅
   */
  async addUserSubscribe(ctx: TcContext) {
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    if (!this.botUserId) {
      throw new Error('机器人未被初始化');
    }

    /**
     * 创建一条测试消息以确保会话被生成
     */
    const converse: any = await ctx.call('chat.converse.createDMConverse', {
      memberIds: [this.botUserId, userId],
    });
    if (!converse._id) {
      throw new Error('会话创建失败');
    }

    const res = await this.adapter.model.create({
      userConverseId: converse._id,
      type: 'user',
    });

    await this.sendPluginBotMessage(ctx, {
      converseId: converse._id,
      content: t('个人消息订阅已创建, subscribeId: {{subscribeId}}', {
        subscribeId: String(res._id),
      }),
    });
  }

  /**
   * 列出所有订阅
   */
  async list(
    ctx: TcContext<{
      groupId: string;
      type: string;
    }>
  ) {
    const { groupId, type } = ctx.params;
    const { userId, t } = ctx.meta;

    const [hasPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION_MANAGE]
    );
    if (!hasPermission) {
      throw new NoPermissionError(t('没有查看权限'));
    }

    const docs = await this.adapter.model
      .find({
        groupId,
        type: type as 'user' | 'group',
      })
      .exec();

    return await this.transformDocuments(ctx, {}, docs);
  }

  /**
   * 列出指定订阅
   */
  async delete(
    ctx: TcContext<{
      groupId: string;
      subscribeId: string;
    }>
  ) {
    const { groupId, subscribeId } = ctx.params;
    const { userId, t } = ctx.meta;

    const [hasPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION_MANAGE]
    );
    if (!hasPermission) {
      throw new NoPermissionError(t('没有删除权限'));
    }

    await this.adapter.model.deleteOne({
      _id: subscribeId,
    });
  }

  /**
   * 处理github webhook 回调
   */
  async webhookHandler(
    ctx: TcPureContext<{
      subscribeId: string;
      text: string;
    }>
  ) {
    if (!this.botUserId) {
      throw new Error('Not Simple Notify bot');
    }

    const subscribe = await this.adapter.model.findById(ctx.params.subscribeId);
    if (!subscribe) {
      throw new Error('没有找到该订阅');
    }

    const groupId = subscribe.groupId;
    const converseId = String(subscribe.converseId);
    await this.sendPluginBotMessage(ctx, {
      groupId,
      converseId,
      content: ctx.params.text,
    });
  }

  private async sendPluginBotMessage(
    ctx: TcPureContext<any>,
    messagePayload: {
      converseId: string;
      groupId?: string;
      content: string;
      meta?: any;
    }
  ) {
    if (!this.botUserId) {
      throw new Error('Not Simple Notify bot');
    }

    const res = await ctx.call(
      'chat.message.sendMessage',
      {
        ...messagePayload,
      },
      {
        meta: {
          userId: this.botUserId,
        },
      }
    );

    return res;
  }
}

export default SimpleNotifyService;
