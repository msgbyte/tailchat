import { TcService, config, TcContext } from 'tailchat-server-sdk';
import type { OpenApp } from '../../models/openapi/app';

class OpenBotService extends TcService {
  get serviceName(): string {
    return 'openapi.bot';
  }

  onInit(): void {
    if (!config.enableOpenapi) {
      return;
    }

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

    this.registerAuthWhitelist(['/openapi/bot/login']);
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
      throw new Error('auth failed.');
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

    return { jwt };
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
      const botId = 'open_' + appInfo._id;
      const nickname = appInfo.appName;
      const avatar = appInfo.appIcon;
      console.log('da', {
        botId,
        nickname,
        avatar,
        appInfo,
      });
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

      this.logger.info('Simple Notify Bot Id:', botUserId);

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
