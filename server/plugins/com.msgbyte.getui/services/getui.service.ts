import { TcService, TcDbService } from 'tailchat-server-sdk';
import type { GetuiLogDocument, GetuiLogModel } from '../models/log';

/**
 * Support Getui Notify in chinese mainland
 */
interface GetuiService
  extends TcService,
    TcDbService<GetuiLogDocument, GetuiLogModel> {}
class GetuiService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.getui';
  }

  onInit() {
    this.registerLocalDb(require('../models/log').default);
  }
}

export default GetuiService;
