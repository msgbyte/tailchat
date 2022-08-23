import {
  TcService,
  TcDbService,
  TcPureContext,
  config,
} from 'tailchat-server-sdk';

/**
 * 配置服务器
 */
class ConfigService extends TcService {
  get serviceName(): string {
    return 'config';
  }

  onInit(): void {
    /**
     * 全局配置
     *
     * 用于提供给前端使用
     */
    this.registerAction('global', this.globalConfig);

    this.registerAuthWhitelist(['/config/global']);
  }

  /**
   * 更新用户在会话中已读的最后一条消息
   */
  async globalConfig(ctx: TcPureContext) {
    return {
      uploadFileLimit: config.storage.limit,
    };
  }
}

export default ConfigService;
