import {
  DataNotFoundError,
  MessageStruct,
  TcContext,
  TcPureContext,
} from 'tailchat-server-sdk';
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

const noticeCacheKey = 'agora:notice:';

/**
 * 声网音视频
 *
 * 为Tailchat增加声网音视频通信功能
 */
interface AgoraService
  extends TcService,
    TcDbService<AgoraMeetingDocument, AgoraMeetingModel> {}
class AgoraService extends TcService {
  botUserId: string | undefined;

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

  /**
   * 返回服务是否可用
   */
  get serverAvailable(): boolean {
    if (
      this.serverAppId &&
      this.serverAppCertificate &&
      this.serverCustomerKey &&
      this.serverCustomerSecret
    ) {
      return true;
    }

    return false;
  }

  onInit() {
    this.registerAvailableAction(() => this.serverAvailable);

    if (!this.serverAvailable) {
      console.warn(
        '声网服务启动失败, 缺少必要的环境变量: AGORA_APP_ID, AGORA_APP_CERT, AGORA_CUSTOMER_KEY, AGORA_CUSTOMER_SECRET'
      );
      return;
    }
    this.registerLocalDb(require('../models/agora-meeting').default);

    this.registerAction('generateJoinInfo', this.generateJoinInfo, {
      params: {
        channelName: 'string',
        userId: { type: 'string', optional: true },
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

  protected onInited(): void {
    // 确保机器人用户存在, 并记录机器人用户id
    this.waitForServices(['user']).then(async () => {
      try {
        const botUserId = await this.broker.call('user.ensurePluginBot', {
          botId: 'agora-meeting',
          nickname: 'Agora Bot',
          avatar: '{BACKEND}/plugins/com.msgbyte.agora/assets/icon.png',
        });

        this.logger.info('Agora Meeting Bot Id:', botUserId);

        this.botUserId = String(botUserId);
      } catch (e) {
        this.logger.error(e);
      }
    });
  }

  generateJoinInfo(
    ctx: TcContext<{
      channelName: string;
      userId?: string;
    }>
  ) {
    const { channelName } = ctx.params;
    const appId = this.serverAppId;
    const appCert = this.serverAppCertificate;

    if (!appId || !appCert) {
      throw new Error('Agora.io AppId/AppCert not init');
    }

    const role = RtcRole.PUBLISHER;

    const userId = ctx.params.userId ?? ctx.meta.userId;

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
   * NOTICE: 暂不支持密钥验证(因为拿不到header)
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
    const { eventType, payload, noticeId } = ctx.params;
    const { t } = ctx.meta;
    const channelName = payload.channelName;

    const valid = await this.checkNoticeValid(noticeId);
    if (!valid) {
      this.logger.debug('agora notice has been handled');
      return true;
    }

    this.logger.info('webhook received', { eventType, payload });
    if (channelName === 'test_webhook') {
      // 连通性检查
      return true;
    }

    if (eventType === 101) {
      // 频道被创建
      const ts = payload.ts;

      const [converseId, groupId] = this.getSourceFromChannelName(channelName);

      const existedMeeting =
        await this.adapter.model.findLastestMeetingByConverseId(converseId);
      if (existedMeeting) {
        // 已经创建了，则跳过
        return;
      }

      const message = await this.sendPluginBotMessage(ctx, {
        converseId,
        groupId,
        content: t('本频道开启了通话'),
      });
      const messageId = String(message._id);

      const meeting = await this.adapter.model.create({
        channelName,
        converseId,
        groupId,
        messageId,
        active: true,
        createdAt: new Date(ts * 1000),
      });

      this.roomcastNotify(ctx, converseId, 'agoraChannelCreate', {
        converseId,
        groupId,
        meetingId: String(meeting._id),
      });
    } else if (eventType === 102) {
      // 频道被销毁
      const ts = payload.ts;

      const [converseId, groupId] = this.getSourceFromChannelName(channelName);

      const meeting = await this.adapter.model.findLastestMeetingByConverseId(
        converseId
      );
      if (!meeting) {
        // 会议不存在，直接跳过
        return;
      }

      meeting.active = false;
      meeting.endAt = new Date(ts * 1000);
      await meeting.save();
      this.roomcastNotify(ctx, converseId, 'agoraChannelDestroy', {
        converseId,
        groupId,
        meetingId: String(meeting._id),
      });

      const duration =
        new Date(meeting.endAt).valueOf() -
        new Date(meeting.createdAt).valueOf();

      this.sendPluginBotMessage(ctx, {
        converseId,
        groupId,
        content: t('通话已结束, 时长: {{num}}分钟', {
          num: Math.round(duration / 1000 / 60),
        }),
      });
    } else if (eventType === 103) {
      // 用户加入
      const { channelName, uid: userId } = payload;
      const [converseId, groupId] = this.getSourceFromChannelName(channelName);

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
        groupId,
        meetingId: String(meeting._id),
        userId,
      });
    } else if (eventType === 104) {
      // 用户离开
      const { channelName, uid } = payload;
      const [converseId, groupId] = this.getSourceFromChannelName(channelName);

      const meeting = await this.adapter.model.findLastestMeetingByConverseId(
        converseId
      );
      if (!meeting) {
        return;
      }

      this.roomcastNotify(ctx, converseId, 'agoraBroadcasterLeave', {
        converseId,
        groupId,
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
  private getSourceFromChannelName(
    channelName: string
  ): [string, string | undefined] {
    if (!channelName) {
      this.logger.error('channel name invalid', channelName);
      throw new Error('channel name invalid');
    }

    const [groupId, converseId] = channelName.split('|');
    if (!db.Types.ObjectId.isValid(converseId)) {
      this.logger.error('converseId invalid:', converseId);
      throw new Error('converseId invalid');
    }

    if (groupId === 'personal') {
      return [converseId, undefined];
    } else {
      if (!db.Types.ObjectId.isValid(groupId)) {
        this.logger.error('groupId invalid:', groupId);
        throw new Error('groupId invalid');
      }

      return [converseId, groupId];
    }
  }

  private async checkNoticeValid(noticeId: string) {
    const key = noticeCacheKey + noticeId;
    const v = await this.broker.cacher.get(key);
    if (v) {
      return false;
    }

    await this.broker.cacher.set(key, '1', 60 * 10); // 1分钟

    return true;
  }

  private async sendPluginBotMessage(
    ctx: TcPureContext<any>,
    messagePayload: {
      converseId: string;
      groupId?: string;
      content: string;
      meta?: any;
    }
  ): Promise<MessageStruct> {
    if (!this.botUserId) {
      this.logger.warn('机器人尚未初始化，无法发送插件消息');
      return;
    }

    const res = await ctx.call(
      'chat.message.sendMessage',
      {
        ...messagePayload,
      },
      {
        meta: {
          userId: this.botUserId,
        },
      }
    );

    return res as MessageStruct;
  }
}

export default AgoraService;
