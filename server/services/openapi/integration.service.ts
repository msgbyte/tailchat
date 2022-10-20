import { call, DataNotFoundError, TcContext } from 'tailchat-server-sdk';
import { TcService, config } from 'tailchat-server-sdk';
import { isValidStr } from '../../lib/utils';
import type { OpenApp } from '../../models/openapi/app';

/**
 * 第三方应用集成
 */
class OpenAppIntegrationService extends TcService {
  get serviceName(): string {
    return 'openapi.integration';
  }

  onInit(): void {
    if (!config.enableOpenapi) {
      return;
    }

    this.registerAction('addBotUser', this.addBotUser, {
      params: {
        appId: 'string',
        groupId: 'string',
      },
    });
  }

  /**
   * 在群组中添加机器人用户
   */
  async addBotUser(
    ctx: TcContext<{
      appId: string;
      groupId: string;
    }>
  ) {
    const appId = ctx.params.appId;
    const groupId = ctx.params.groupId;
    const t = ctx.meta.t;

    const openapp: OpenApp = await ctx.call('openapi.app.get', {
      appId,
    });

    if (!openapp) {
      throw new DataNotFoundError();
    }

    if (!openapp.capability.includes('bot')) {
      throw new Error(t('该应用的机器人服务尚未开通'));
    }

    const botAccount: any = await ctx.call(
      'openapi.bot.getOrCreateBotAccount',
      {
        appId,
      }
    );

    const userId = botAccount.userId;
    if (!isValidStr(userId)) {
      throw new Error(t('无法获取到机器人ID'));
    }

    await ctx.call(
      'group.joinGroup',
      {
        groupId,
      },
      {
        meta: {
          userId,
        },
      }
    );

    await call(ctx).addGroupSystemMessage(
      String(groupId),
      `${ctx.meta.user.nickname} 在群组中添加了机器人 ${botAccount.nickname}`
    );
  }
}

export default OpenAppIntegrationService;
