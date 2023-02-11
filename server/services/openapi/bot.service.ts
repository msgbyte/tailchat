import { TcService, config, TcContext, call } from 'tailchat-server-sdk';
import { isValidStr, isValidUrl } from '../../lib/utils';
import type { OpenApp } from '../../models/openapi/app';
import got from 'got';
import _ from 'lodash';

class OpenBotService extends TcService {
  get serviceName(): string {
    return 'openapi.bot';
  }

  onInit(): void {
    if (!config.enableOpenapi) {
      return;
    }

    this.registerEventListener('chat.inbox.append', async (payload, ctx) => {
      const userInfo = await call(ctx).getUserInfo(String(payload.userId));

      if (!userInfo) {
        return;
      }

      if (userInfo.type !== 'openapiBot') {
        return;
      }

      // 开放平台机器人
      const botId: string | null = await ctx.call('user.findOpenapiBotId', {
        email: userInfo.email,
      });

      if (!(isValidStr(botId) && botId.startsWith('open_'))) {
        return;
      }

      // 是合法的机器人id

      const appId = botId.replace('open_', '');
      const appInfo: OpenApp | null = await ctx.call('openapi.app.get', {
        appId,
      });
      const callbackUrl = _.get(appInfo, 'bot.callbackUrl');

      if (!isValidUrl(callbackUrl)) {
        this.logger.info('机器人回调地址不是一个可用的url, skip.');
        return;
      }

      got
        .post(callbackUrl, { json: payload })
        .then(() => {
          this.logger.info('调用机器人通知接口回调成功');
        })
        .catch((err) => {
          this.logger.error('调用机器人通知接口回调失败:', err);
        });
    });

    this.registerAction('login', this.login, {
      params: {
        appId: 'string',
        token: 'string',
      },
    });
    this.registerAction('getOrCreateBotAccount', this.getOrCreateBotAccount, {
      params: {
        appId: 'string',
      },
      visibility: 'public',
    });

    this.registerAuthWhitelist(['/login']);
  }

  /**
   * 登录
   *
   * 并自动创建机器人账号
   */
  async login(ctx: TcContext<{ appId: string; token: string }>) {
    const { appId, token } = ctx.params;
    const valid = await ctx.call('openapi.app.authToken', {
      appId,
      token,
      capability: ['bot'],
    });

    if (!valid) {
      throw new Error('Auth failed.');
    }

    // 校验通过, 获取机器人账号存在
    const { userId, email, nickname, avatar } = await this.localCall(
      'getOrCreateBotAccount',
      {
        appId,
      }
    );

    const jwt: string = await ctx.call('user.generateUserToken', {
      userId,
      email,
      nickname,
      avatar,
    });

    return { jwt, userId, email, nickname, avatar };
  }

  /**
   * 获取或创建机器人账号
   */
  async getOrCreateBotAccount(ctx: TcContext<{ appId: string }>): Promise<{
    userId: string;
    email: string;
    nickname: string;
    avatar: string;
  }> {
    const appId = ctx.params.appId;
    await this.waitForServices(['user']);

    const appInfo: OpenApp = await ctx.call('openapi.app.get', {
      appId,
    });

    try {
      const botId = 'open_' + appInfo.appId;
      const nickname = appInfo.appName;
      const avatar = appInfo.appIcon;
      const { _id: botUserId, email } = await ctx.call<
        {
          _id: string;
          email: string;
        },
        any
      >('user.ensureOpenapiBot', {
        botId,
        nickname,
        avatar,
      });

      this.logger.info('[getOrCreateBotAccount] Bot Id:', botUserId);

      return {
        userId: String(botUserId),
        email,
        nickname,
        avatar,
      };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}

export default OpenBotService;
