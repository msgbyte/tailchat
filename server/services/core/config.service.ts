import _ from 'lodash';
import { TcService, TcPureContext, config } from 'tailchat-server-sdk';

/**
 * 配置服务器
 */
class ConfigService extends TcService {
  config = {}; // 自管理的配置项，globalConfig是同步过来的

  get serviceName(): string {
    return 'config';
  }

  onInit(): void {
    this.registerAction('client', this.client);
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
  }

  /**
   * 全局配置
   *
   * 用于提供给前端使用
   *
   * NOTICE: 返回内容比较简单，因此不建议增加缓存
   */
  async client(ctx: TcPureContext) {
    return {
      uploadFileLimit: config.storage.limit,
      emailVerification: config.emailVerification,
    };
  }

  async all(ctx: TcPureContext) {
    return this.config;
  }

  async get(ctx: TcPureContext<{ key: string }>) {
    return this.config[ctx.params.key] ?? null;
  }

  async set(ctx: TcPureContext<{ key: string; value: any }>) {
    const { key, value } = ctx.params;

    _.set(this.config, key, value);
    await this.broker.broadcast('config.updated', { config: this.config });
  }

  /**
   * 添加到设置但不重复
   */
  async addToSet(ctx: TcPureContext<{ key: string; value: any }>) {
    const { key, value } = ctx.params;

    const originConfig = _.get(this.config, key) ?? [];
    _.set(this.config, key, _.uniq([...originConfig, value]));

    await this.broker.broadcast('config.updated', { config: this.config });
  }
}

export default ConfigService;
