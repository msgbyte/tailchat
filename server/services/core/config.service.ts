import { TcService, TcPureContext, config } from 'tailchat-server-sdk';

/**
 * 配置服务器
 */
class ConfigService extends TcService {
  config = {};

  get serviceName(): string {
    return 'config';
  }

  onInit(): void {
    /**
     * 全局配置
     *
     * 用于提供给前端使用
     */
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

    this.registerAuthWhitelist(['/config/client']);
  }

  /**
   * 全局配置
   *
   * 用于提供给前端使用d
   */
  async client(ctx: TcPureContext) {
    return {
      uploadFileLimit: config.storage.limit,
    };
  }

  async all(ctx: TcPureContext) {
    return this.config;
  }

  async get(ctx: TcPureContext<{ key: string }>) {
    return this.config[ctx.params.key] ?? null;
  }

  async set(ctx: TcPureContext<{ key: string; value: string }>) {
    const { key, value } = ctx.params;

    this.config[key] = value;
    await this.broker.broadcast('config.updated', this.config);
  }
}

export default ConfigService;
