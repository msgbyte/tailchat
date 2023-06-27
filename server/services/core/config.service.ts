import _ from 'lodash';
import {
  TcService,
  TcPureContext,
  config,
  TcDbService,
  TcContext,
} from 'tailchat-server-sdk';
import type { ConfigDocument, ConfigModel } from '../../models/config';

/**
 * 配置服务器
 */
interface ConfigService
  extends TcService,
    TcDbService<ConfigDocument, ConfigModel> {}
class ConfigService extends TcService {
  config = {}; // 自管理的配置项，globalConfig是同步过来的

  get serviceName(): string {
    return 'config';
  }

  onInit(): void {
    this.registerLocalDb(require('../../models/config').default);
    this.registerAction('client', this.client, {
      cache: {
        keys: [],
        ttl: 24 * 60 * 60, // 1 day
      },
    });
    this.registerAction('setClientConfig', this.setClientConfig, {
      params: {
        key: 'string',
        value: 'any',
      },
      visibility: 'public',
    });
    this.registerAction('all', this.all, {
      visibility: 'public',
    });
    this.registerAction('get', this.get, {
      visibility: 'public',
      params: {
        key: 'string',
      },
    });
    this.registerAction('set', this.set, {
      visibility: 'public',
      params: {
        key: 'string',
        value: 'any',
      },
    });
    this.registerAction('addToSet', this.addToSet, {
      visibility: 'public',
      params: {
        key: 'string',
        value: 'any',
      },
    });

    this.registerAuthWhitelist(['/client']);
    if (config.env === 'development') {
      this.cleanActionCache('client'); // 初始化时清理缓存
    }
  }

  /**
   * 全局配置
   *
   * 用于提供给前端使用
   *
   * NOTICE: 返回内容比较简单，因此不建议增加缓存
   */
  async client(ctx: TcPureContext) {
    const persistConfig = await this.adapter.model.getAllClientPersistConfig();

    return {
      uploadFileLimit: config.storage.limit,
      emailVerification: config.emailVerification,
      disableUserRegister: config.feature.disableUserRegister,
      disableGuestLogin: config.feature.disableGuestLogin,
      disableCreateGroup: config.feature.disableCreateGroup,
      ...persistConfig,
    };
  }

  /**
   * set client config in tailchat network
   *
   * usually call from admin
   */
  async setClientConfig(
    ctx: TcContext<{
      key: string;
      value: any;
    }>
  ) {
    const { key, value } = ctx.params;
    await this.adapter.model.setClientPersistConfig(key, value);
    await this.cleanActionCache('client', []);
  }

  async all(ctx: TcContext) {
    return this.config;
  }

  async get(ctx: TcContext<{ key: string }>) {
    return this.config[ctx.params.key] ?? null;
  }

  async set(ctx: TcContext<{ key: string; value: any }>) {
    const { key, value } = ctx.params;

    _.set(this.config, key, value);
    await this.broker.broadcast('config.updated', { config: this.config });
  }

  /**
   * 添加到设置但不重复
   */
  async addToSet(ctx: TcContext<{ key: string; value: any }>) {
    const { key, value } = ctx.params;

    const originConfig = _.get(this.config, key) ?? [];
    _.set(this.config, key, _.uniq([...originConfig, value]));

    await this.broker.broadcast('config.updated', { config: this.config });
  }
}

export default ConfigService;
