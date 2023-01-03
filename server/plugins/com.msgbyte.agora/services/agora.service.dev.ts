import { DataNotFoundError, TcContext } from 'tailchat-server-sdk';
import { TcService, TcDbService, db } from 'tailchat-server-sdk';
import type {
  AgoraMeetingDocument,
  AgoraMeetingModel,
} from '../models/agora-meeting';
import { RtcTokenBuilder, Role as RtcRole } from './utils/RtcTokenBuilder2';
import got from 'got';
import _ from 'lodash';

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
    TcDbService<AgoraMeetingDocument, AgoraMeetingModel> {}
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
      console.warn(
        '声网服务启动失败, 缺少必要的环境变量: AGORA_APP_ID, AGORA_APP_CERT, AGORA_CUSTOMER_KEY, AGORA_CUSTOMER_SECRET'
      );
      return;
    }
    this.registerLocalDb(require('../models/agora-meeting').default);

    this.registerAction('generateJoinInfo', this.generateJoinInfo, {
      params: {
        channelName: 'string',
      },
    });
    this.registerAction('getChannelUserList', this.getChannelUserList, {
      params: {
        channelName: 'string',
      },
    });
    this.registerAction('webhook', this.webhook, {
      params: {
        noticeId: 'string',
        productId: 'number',
        eventType: 'number',
        notifyMs: 'number',
        payload: 'any',
      },
    });

    this.registerAuthWhitelist(['/webhook']);
  }

  generateJoinInfo(
    ctx: TcContext<{
      channelName: string;
    }>
  ) {
    const { channelName } = ctx.params;
    const appId = this.serverAppId;
    const appCert = this.serverAppCertificate;

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

    return { appId, token };
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
   * agora服务的回调
   * Reference: https://docs.agora.io/cn/live-streaming-premium-legacy/rtc_channel_event?platform=RESTful#101-channel-create
   */
  async webhook(
    ctx: TcContext<{
      noticeId: string;
      productId: number;
      eventType: number;
      notifyMs: number;
      payload: any;
    }>
  ) {
    const { eventType, payload } = ctx.params;
    const channelName = payload.channelName;

    this.logger.info('webhook received', { eventType, payload });
    if (channelName === 'test_webhook') {
      // 连通性检查
      return true;
    }

    if (eventType === 101) {
      // 频道被创建
      const ts = payload.ts;

      const converseId = this.getConverseIdFromChannelName(channelName);

      const meeting = await this.adapter.model.create({
        channelName,
        converseId,
        active: true,
        createdAt: new Date(ts),
      });
      this.roomcastNotify(ctx, converseId, 'agoraChannelCreate', {
        converseId,
        meetingId: String(meeting._id),
      });
    } else if (eventType === 102) {
      // 频道被销毁
      const ts = payload.ts;

      const converseId = this.getConverseIdFromChannelName(channelName);

      const meeting = await this.adapter.model.findLastestMeetingByConverseId(
        converseId
      );
      if (!meeting) {
        return;
      }

      meeting.active = false;
      meeting.endAt = new Date(ts);
      await meeting.save();
      this.roomcastNotify(ctx, converseId, 'agoraChannelDestroy', {
        converseId,
        meetingId: String(meeting._id),
      });
    } else if (eventType === 103) {
      // 用户加入
      const { channelName, uid: userId } = payload;
      const converseId = this.getConverseIdFromChannelName(channelName);

      const meeting = await this.adapter.model.findLastestMeetingByConverseId(
        converseId
      );
      if (!meeting) {
        return;
      }
      meeting.members = _.uniq([...meeting.members, userId]);
      await meeting.save();

      this.roomcastNotify(ctx, converseId, 'agoraBroadcasterJoin', {
        converseId,
        meetingId: String(meeting._id),
        userId,
      });
    } else if (eventType === 104) {
      // 用户离开
      const { channelName, uid } = payload;
      const converseId = this.getConverseIdFromChannelName(channelName);

      const meeting = await this.adapter.model.findLastestMeetingByConverseId(
        converseId
      );
      if (!meeting) {
        return;
      }

      this.roomcastNotify(ctx, converseId, 'agoraBroadcasterLeave', {
        converseId,
        meetingId: String(meeting._id),
        userId: uid,
      });
    }
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

  /**
   * NOTICE: 这里不用每次唯一的ChannelName是期望设计是会话维度的，即可以重复使用
   */
  private getConverseIdFromChannelName(channelName: string): string {
    if (!channelName) {
      this.logger.error('channel name invalid', channelName);
      throw new Error('channel name invalid');
    }

    const [groupId, converseId] = channelName.split('|');
    if (!db.Types.ObjectId.isValid(converseId)) {
      this.logger.error('converseId invalid:', converseId);
      throw new Error('converseId invalid');
    }

    return converseId;
  }
}

export default AgoraService;
