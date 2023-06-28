import { TcService, TcDbService, TcPureContext } from 'tailchat-server-sdk';
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
    // this.registerLocalDb(require('../models/fim').default);

    strategies
      .filter((strategy) => strategy.checkAvailable())
      .map((strategy) => {
        const action = this.buildStrategyAction(strategy);
        const name = strategy.name;
        this.registerAction(`${name}.url`, action.url);
        this.registerAction(`${name}.redirect`, action.redirect);

        this.registerAuthWhitelist([`/${name}/url`, `/${name}/redirect`]);
      });
  }

  buildStrategyAction(strategy: StrategyType) {
    return {
      url: async (ctx: TcPureContext) => {
        return strategy.getUrl();
      },
      redirect: async (ctx: TcPureContext<{ code: string }>) => {
        const code = ctx.params.code;

        if (!code) {
          throw new Error(JSON.stringify(ctx.params));
        }

        return strategy.getUserInfo(code);
      },
    };
  }
}

export default FimService;
