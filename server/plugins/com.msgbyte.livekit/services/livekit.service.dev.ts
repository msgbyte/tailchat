import type { TcContext } from 'tailchat-server-sdk';
import { TcService, TcDbService } from 'tailchat-server-sdk';
import type { LivekitDocument, LivekitModel } from '../models/livekit';
import { AccessToken } from 'livekit-server-sdk';

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

  get livekitUrl() {
    return process.env.LIVEKIT_URL;
  }

  get apiKey() {
    return process.env.LIVEKIT_API_KEY;
  }

  get apiSecret() {
    return process.env.LIVEKIT_API_SECRET;
  }

  /**
   * 返回服务是否可用
   */
  get serverAvailable(): boolean {
    if (this.apiKey && this.apiSecret) {
      return true;
    }

    return false;
  }

  onInit() {
    this.registerAvailableAction(() => this.serverAvailable);

    if (!this.serverAvailable) {
      console.warn(
        'Livekit service not available, miss env var: LIVEKIT_API_KEY, LIVEKIT_API_SECRET'
      );
      return;
    }

    this.registerLocalDb(require('../models/livekit').default);

    this.registerAction('url', this.url);
    this.registerAction('generateToken', this.generateToken);
  }

  async url(ctx: TcContext) {
    return {
      url: this.livekitUrl,
    };
  }

  async generateToken(
    ctx: TcContext<{
      roomName: string;
    }>
  ) {
    const { roomName } = ctx.params;

    const { userId, user } = ctx.meta;
    const nickname = user.nickname;
    const identity = userId;

    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: userId,
      name: nickname,
    });
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });
    const accessToken = at.toJwt();

    return {
      identity,
      accessToken,
    };
  }
}

export default LivekitService;
