import {
  TcService,
  TcPureContext,
  TcContext,
  TcDbService,
  call,
  NoPermissionError,
} from 'tailchat-server-sdk';
import type { WebhookEvent } from '@octokit/webhooks-types';
import type { SubscribeDocument, SubscribeModel } from '../models/subscribe';

const PERMISSION_MANAGE = 'plugin.com.msgbyte.github.subscribe.manage';

/**
 * Github订阅服务
 */

interface GithubSubscribeService
  extends TcService,
    TcDbService<SubscribeDocument, SubscribeModel> {}
class GithubSubscribeService extends TcService {
  botUserId: string | undefined;

  get serviceName() {
    return 'plugin:com.msgbyte.github.subscribe';
  }

  onInit() {
    this.registerLocalDb(require('../models/subscribe').default);

    this.registerAction('add', this.add, {
      params: {
        groupId: 'string',
        textPanelId: 'string',
        repoName: 'string',
      },
    });
    this.registerAction('list', this.list, {
      params: {
        groupId: 'string',
      },
    });
    this.registerAction('delete', this.delete, {
      params: {
        groupId: 'string',
        subscribeId: 'string',
      },
    });
    this.registerAction('webhook.callback', this.webhookHandler);

    this.registerAuthWhitelist(['/webhook/callback']);
  }

  protected onInited(): void {
    // 确保机器人用户存在, 并记录机器人用户id
    this.waitForServices(['user']).then(async () => {
      try {
        const botUserId = await this.broker.call('user.ensurePluginBot', {
          botId: 'github-bot',
          nickname: 'Github Bot',
          avatar: 'https://api.iconify.design/entypo-social/github.svg',
        });

        this.logger.info('Github Bot Id:', botUserId);

        this.botUserId = String(botUserId);
      } catch (e) {
        this.logger.error(e);
      }
    });
  }

  /**
   * 添加订阅
   */
  async add(
    ctx: TcContext<{
      groupId: string;
      textPanelId: string;
      repoName: string;
    }>
  ) {
    const { groupId, textPanelId, repoName } = ctx.params;
    const { userId, t } = ctx.meta;

    if (!groupId || !textPanelId || !repoName) {
      throw new Error('Incomplete parameters');
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
      repoName,
    });
  }

  /**
   * 列出所有订阅
   */
  async list(
    ctx: TcContext<{
      groupId: string;
    }>
  ) {
    const groupId = ctx.params.groupId;
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
  async webhookHandler(ctx: TcPureContext<any>) {
    if (!this.botUserId) {
      throw new Error('Not github bot');
    }

    const event = ctx.params as WebhookEvent;

    if ('pusher' in event) {
      // Is push event
      const name = event.pusher.name;
      const userUrl = event.sender.html_url;
      const repo = event.repository.full_name;
      const compareUrl = event.compare;
      const commits = event.commits.map((c) => `- ${c.message}`).join('\n');

      const message = `[url=${userUrl}]${name}[/url] committed new content in ${repo}:\n${commits}\n\nView changes: ${compareUrl}`;

      await this.sendMessageToSubscribes(ctx, repo, message);
    } else if ('pull_request' in event) {
      const name = event.sender.login;
      const userUrl = event.sender.html_url;
      const repo = event.repository.full_name;
      const url = event.pull_request.html_url;
      const title = event.pull_request.title;
      const body = event.pull_request.body;

      let message = `[url=${userUrl}]${name}[/url] updated PR request at ${repo}:\nURL: ${url}`;
      if (event.action === 'opened') {
        message = `[url=${userUrl}]${name}[/url] created a PR request at ${repo}:\n${title}\n[markdown]${
          body ?? ''
        }[/markdown]\n网址: ${url}`;
      } else if (event.action === 'created') {
        const comment = event.comment;
        message = `[url=${userUrl}]${name}[/url] replied PR request at ${repo}:\n${title}\n[markdown]${
          comment.body ?? ''
        }[/markdown]\n网址: ${url}`;
      } else if (event.action === 'closed') {
        message = `[url=${userUrl}]${name}[/url] closed PR request at ${repo}:\n${title}\n\nURL: ${url}`;
      }

      await this.sendMessageToSubscribes(ctx, repo, message);
    } else if ('issue' in event) {
      const name = event.sender.login;
      const userUrl = event.sender.html_url;
      const repo = event.repository.full_name;
      const url = event.issue.html_url;
      const title = event.issue.title;

      let message = `[url=${userUrl}]${name}[/url] updated Issue in ${repo}:\n${title}\n\nURL: ${url}`;
      if (event.action === 'opened') {
        // @ts-ignore 这里不知道为什么判断issue为never 跳过
        const body = event.issue.body;
        message = `[url=${userUrl}]${name}[/url] created an Issue in ${repo}:\n${title}\n[markdown]${
          body ?? ''
        }[/markdown]\nURL: ${url}`;
      } else if (event.action === 'created') {
        const comment = event.comment;
        message = `[url=${userUrl}]${name}[/url] replied to Issue in ${repo}:\n${title}\nReply content:[markdown]${
          comment.body ?? ''
        }[/markdown]\nURL: ${url}`;
      } else if (event.action === 'closed') {
        message = `[url=${userUrl}]${name}[/url] closed Issue in ${repo}:\n${title}\n\nURL: ${url}`;
      }

      await this.sendMessageToSubscribes(ctx, repo, message);
    }
  }

  /**
   * 向订阅者发送消息
   */
  private async sendMessageToSubscribes(
    ctx: TcPureContext,
    repoName: string,
    message: string
  ) {
    const subscribes = await this.adapter.model.find({
      repoName,
    });

    this.logger.info(
      'Send Github push notification:',
      subscribes
        .map((s) => `${s.repoName}|${s.groupId}|${s.textPanelId}`)
        .join(',')
    );

    for (const s of subscribes) {
      const groupId = String(s.groupId);
      const converseId = String(s.textPanelId);

      this.sendPluginBotMessage(ctx, {
        groupId,
        converseId,
        content: message,
      });
    }
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

export default GithubSubscribeService;
