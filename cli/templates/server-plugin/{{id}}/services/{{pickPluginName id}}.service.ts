import { TcService, TcDbService } from 'tailchat-server-sdk';
import type { {{pickPluginNameUp id}}Document, {{pickPluginNameUp id}}Model } from '../models/{{pickPluginName id}}';

/**
 * 任务管理服务
 */
interface {{pickPluginNameUp id}}Service
  extends TcService,
    TcDbService<{{pickPluginNameUp id}}Document, {{pickPluginNameUp id}}Model> {}
class {{pickPluginNameUp id}}Service extends TcService {
  get serviceName() {
    return 'plugin:{{id}}';
  }

  onInit() {
    this.registerLocalDb(require('../models/{{pickPluginName id}}').default);
  }
}

export default {{pickPluginNameUp id}}Service;
