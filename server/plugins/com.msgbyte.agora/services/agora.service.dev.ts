import { TcService, TcDbService } from 'tailchat-server-sdk';
import type { AgoraDocument, AgoraModel } from '../models/agora';

/**
 * 声网音视频
 *
 * 为Tailchat增加声网音视频通信功能
 */
interface AgoraService
  extends TcService,
    TcDbService<AgoraDocument, AgoraModel> {}
class AgoraService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.agora';
  }

  /**
   * 声网服务端的appid
   */
  get serverAppId() {
    return process.env.AGORA_APP_ID;
  }

  /**
   * 声网服务端的app证书
   */
  get serverAppCertificate() {
    return process.env.AGORA_APP_CERT;
  }

  onInit() {
    // this.registerLocalDb(require('../models/agora').default);
  }
}

export default AgoraService;
