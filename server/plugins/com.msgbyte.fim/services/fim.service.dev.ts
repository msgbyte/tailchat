import { TcService, TcDbService, TcPureContext, db } from 'tailchat-server-sdk';
import type { UserStructWithToken } from 'tailchat-server-sdk/src/structs/user';
import type { FimDocument, FimModel } from '../models/fim';
import { strategies } from '../strategies';
import type { StrategyType } from '../strategies/types';

/**
 * Federated Identity Management
 *
 * Unified identity authentication
 */
interface FimService extends TcService, TcDbService<FimDocument, FimModel> {}
class FimService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.fim';
  }

  onInit() {
    this.registerLocalDb(require('../models/fim').default);

    const availableStrategies = strategies.filter((strategy) =>
      strategy.checkAvailable()
    );

    this.registerAction('availableStrategies', () => {
      return availableStrategies.map((s) => ({
        name: s.name,
        type: s.type,
        icon: s.icon,
      }));
    });

    availableStrategies.forEach((strategy) => {
      const action = this.buildStrategyAction(strategy);
      const strategyName = strategy.name;
      this.registerAction(`${strategyName}.loginUrl`, action.loginUrl);
      this.registerAction(`${strategyName}.redirect`, action.redirect);

      this.registerAuthWhitelist([
        `/${strategyName}/loginUrl`,
        `/${strategyName}/redirect`,
      ]);
    });

    this.registerAuthWhitelist(['/availableStrategies']);
  }

  buildStrategyAction(strategy: StrategyType) {
    const strategyName = strategy.name;

    return {
      loginUrl: async (ctx: TcPureContext) => {
        return strategy.getUrl();
      },
      redirect: async (ctx: TcPureContext<{ code: string }>) => {
        const code = ctx.params.code;

        if (!code) {
          throw new Error(JSON.stringify(ctx.params));
        }

        const providerUserInfo = await strategy.getUserInfo(code);

        const fimRecord = await this.adapter.model.findOne({
          provider: strategyName,
          providerId: providerUserInfo.id,
        });

        if (!!fimRecord) {
          // 存在记录，直接签发 token
          const token = await ctx.call('user.signUserToken', {
            userId: fimRecord.userId,
          });

          return generatePostMessageHtml({
            type: 'token',
            token: token,
          });
        }

        // 不存在记录，查找是否已经注册过，如果已经注册过需要绑定，如果没有注册过则创建账号并绑定用户关系
        const userInfo = await ctx.call('user.findUserByEmail', {
          email: providerUserInfo.email,
        });
        if (!!userInfo) {
          // 用户已存在，需要登录后才能确定绑定关系
          return generatePostMessageHtml({ type: 'existed' });
        }

        const newUserInfo: UserStructWithToken = await ctx.call(
          'user.register',
          {
            email: providerUserInfo.email,
            nickname: providerUserInfo.nickname,
            password: new db.Types.ObjectId(), // random password
          }
        );

        await this.adapter.model.create({
          provider: strategyName,
          providerId: providerUserInfo.id,
          userId: String(newUserInfo._id),
        });

        return generatePostMessageHtml({
          type: 'token',
          isNew: true,
          token: newUserInfo.token,
        });
      },
    };
  }
}

function generatePostMessageHtml(obj: Record<string, any>) {
  return {
    __raw: true,
    html: `<script>window.postMessage(${JSON.stringify(obj)})</script>`,
  };
}

export default FimService;
