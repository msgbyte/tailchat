import { TcService, TcDbService } from 'tailchat-server-sdk';
import type { LivekitDocument, LivekitModel } from '../models/livekit';

/**
 * livekit
 *
 * Add livekit to provide meeting and live streaming feature
 */
interface LivekitService
  extends TcService,
    TcDbService<LivekitDocument, LivekitModel> {}
class LivekitService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.livekit';
  }

  onInit() {
    this.registerLocalDb(require('../models/livekit').default);
  }
}

export default LivekitService;
