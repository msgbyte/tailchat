import { DataNotFoundError, TcContext } from 'tailchat-server-sdk';
import { TcService, TcDbService } from 'tailchat-server-sdk';
import type { AgoraDocument, AgoraModel } from '../models/agora';
import { RtcTokenBuilder, Role as RtcRole } from './utils/RtcTokenBuilder2';
import got from 'got';

// Reference: https://docs.agora.io/cn/metachat/rtc_channel_management_restfulapi#查询用户列表
interface ChannelUserListRet {
  success: boolean;
  data:
    | {
        channel_exist: false;
      }
    | {
        channel_exist: true;
        mode: 1 | 2;
        total: number;
        users: string[]; // 频道内所有用户的用户 ID
        broadcasters: string[]; // 频道内所有主播的用户 ID。该字段仅在直播场景
        audience: string[]; // 频道内观众的用户 ID。最多包含当前频道内前 10,000 名观众的用户 ID。该字段仅在直播场景 （mode 的值为 2）下返回。
        audience_total: number; // 频道内的观众总人数。该字段仅在直播场景 （mode 的值为 2）下返回。
      };
}

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

  /**
   * 声网服务端restful的客户 ID
   */
  get serverCustomerKey() {
    return process.env.AGORA_CUSTOMER_KEY;
  }

  /**
   * 声网服务端restful的客户 秘钥
   */
  get serverCustomerSecret() {
    return process.env.AGORA_CUSTOMER_SECRET;
  }

  onInit() {
    if (
      !this.serverAppId ||
      !this.serverAppCertificate ||
      !this.serverCustomerKey ||
      !this.serverCustomerSecret
    ) {
      this.logger.warn(
        '声网服务启动失败, 缺少必要的环境变量。AGORA_APP_ID, AGORA_APP_CERT, AGORA_CUSTOMER_KEY, AGORA_CUSTOMER_SECRET'
      );
      return;
    }
    // this.registerLocalDb(require('../models/agora').default);

    this.registerAction('generateToken', this.generateToken, {
      params: {
        channelName: 'string',
        appId: { type: 'string', optional: true },
        appCert: { type: 'string', optional: true },
      },
    });
    this.registerAction('getChannelUserList', this.getChannelUserList, {
      params: {
        channelName: 'string',
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

  /**
   * 获取频道用户列表
   */
  async getChannelUserList(
    ctx: TcContext<{
      channelName: string;
    }>
  ): Promise<ChannelUserListRet['data']> {
    const { channelName } = ctx.params;

    const { data } = await got
      .get(
        `https://api.agora.io/dev/v1/channel/user/${this.serverAppId}/${channelName}`,
        {
          headers: this.generateRESTfulHeaders(),
        }
      )
      .json<ChannelUserListRet>();

    if (data.channel_exist === false) {
      throw new DataNotFoundError('Channel not exist');
    }

    return data;
  }

  /**
   * 生成restful api需要的请求头
   */
  private generateRESTfulHeaders() {
    const encodedCredential = Buffer.from(
      this.serverCustomerKey + ':' + this.serverCustomerSecret
    ).toString('base64');

    return {
      Authorization: 'Basic ' + encodedCredential,
      'Content-Type': 'application/json',
    };
  }
}

export default AgoraService;
