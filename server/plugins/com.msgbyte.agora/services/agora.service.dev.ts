import { TcContext } from 'tailchat-server-sdk';
import { TcService, TcDbService } from 'tailchat-server-sdk';
import type { AgoraDocument, AgoraModel } from '../models/agora';
import { RtcTokenBuilder, Role as RtcRole } from './utils/RtcTokenBuilder2';

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

    this.registerAction('generateToken', this.generateToken, {
      params: {
        channelName: 'string',
        appId: { type: 'string', optional: true },
        appCert: { type: 'string', optional: true },
      },
    });
  }

  generateToken(
    ctx: TcContext<{
      channelName: string;
      appId?: string;
      appCert?: string;
    }>
  ) {
    const {
      channelName,
      appId = this.serverAppId,
      appCert = this.serverAppCertificate,
    } = ctx.params;

    if (!appId || !appCert) {
      throw new Error('Agora.io AppId/AppCert not init');
    }

    const role = RtcRole.PUBLISHER;

    const userId = ctx.meta.userId;

    const tokenExpirationInSecond = 3600; // 1h
    const privilegeExpirationInSecond = 3600; // 1h

    // Build token with user account
    const token = RtcTokenBuilder.buildTokenWithUserAccount(
      appId,
      appCert,
      channelName,
      userId,
      role,
      tokenExpirationInSecond,
      privilegeExpirationInSecond
    );

    return token;
  }
}

export default AgoraService;
