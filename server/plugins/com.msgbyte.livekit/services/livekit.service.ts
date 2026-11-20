import type { TcContext } from 'tailchat-server-sdk';
import {
  TcService,
  TcDbService,
  call,
  db,
  NoPermissionError,
  SYSTEM_USERID,
} from 'tailchat-server-sdk';
import type { LivekitDocument, LivekitModel } from '../models/livekit';
import {
  AccessToken,
  RoomServiceClient,
  WebhookEvent,
} from 'livekit-server-sdk';

/**
 * livekit
 *
 * Add livekit to provide meeting and live streaming feature
 */
interface LivekitService
  extends TcService,
    TcDbService<LivekitDocument, LivekitModel> {}
class LivekitService extends TcService {
  // roomServiceClient: RoomServiceClient = null;

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

  getRoomServiceClient() {
    return new RoomServiceClient(this.livekitUrl, this.apiKey, this.apiSecret);
  }

  onInit() {
    this.registerAvailableAction(() => this.serverAvailable);

    if (!this.serverAvailable) {
      console.warn(
        'Livekit service not available, miss env var: LIVEKIT_API_KEY, LIVEKIT_API_SECRET'
      );
      return;
    }

    // this.registerLocalDb(require('../models/livekit').default);

    this.registerAction('url', this.url);
    this.registerAction('generateToken', this.generateToken, {
      params: {
        roomName: 'string',
      },
    });
    this.registerAction('roomMembers', this.roomMembers, {
      params: {
        roomName: 'string',
      },
    });
    this.registerAction('inviteCall', this.inviteCall, {
      params: {
        roomName: 'string',
        targetUserIds: { type: 'array', items: 'string' },
      },
    });
    this.registerAction('webhook', this.webhook, {
      visibility: 'public',
    });
  }

  private async ensureRoomPermission(
    ctx: TcContext,
    roomName: string
  ): Promise<{ memberIds?: string[] }> {
    const { userId, t } = ctx.meta;
    if (userId === SYSTEM_USERID) {
      return {};
    }

    if (roomName.includes('#')) {
      const parts = roomName.split('#');
      if (
        parts.length !== 2 ||
        !db.Types.ObjectId.isValid(parts[0]) ||
        !db.Types.ObjectId.isValid(parts[1])
      ) {
        throw new NoPermissionError(t('没有操作权限'));
      }

      const [groupId, panelId] = parts;
      const groupInfo = await call(ctx).getGroupInfo(groupId);
      if (
        !groupInfo ||
        !groupInfo.members.some((m) => String(m.userId) === String(userId)) ||
        !groupInfo.panels.some((p) => String(p.id) === String(panelId))
      ) {
        throw new NoPermissionError(t('没有操作权限'));
      }

      return {
        memberIds: groupInfo.members.map((m) => String(m.userId)),
      };
    }

    if (!db.Types.ObjectId.isValid(roomName)) {
      throw new NoPermissionError(t('没有操作权限'));
    }

    const converse = await ctx.call<
      { members?: unknown[] } | null,
      { converseId: string }
    >('chat.converse.findConverseInfo', {
      converseId: roomName,
    });
    if (!converse) {
      throw new NoPermissionError(t('没有操作权限'));
    }

    return {
      memberIds: (converse.members ?? []).map(String),
    };
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

    await this.ensureRoomPermission(ctx, roomName);

    const { userId, user } = ctx.meta;
    const nickname = user?.nickname ?? userId;
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

  async roomMembers(ctx: TcContext<{ roomName: string }>) {
    if (!this.serverAvailable) {
      throw new Error('livekit server not available');
    }

    await this.ensureRoomPermission(ctx, ctx.params.roomName);

    try {
      const client = this.getRoomServiceClient();
      const participants = await client.listParticipants(ctx.params.roomName);

      return participants;
    } catch (err) {
      return [];
    }
  }

  /**
   * 邀请加入会话
   */
  async inviteCall(
    ctx: TcContext<{ roomName: string; targetUserIds: string[] }>
  ) {
    const { roomName, targetUserIds } = ctx.params;
    const senderUserId = ctx.meta.userId;

    const { memberIds } = await this.ensureRoomPermission(ctx, roomName);
    const allowedTargetIds = Array.isArray(memberIds)
      ? targetUserIds.filter((id) => memberIds.includes(String(id)))
      : targetUserIds;

    if (allowedTargetIds.length === 0) {
      return {
        online: [],
        offline: [],
      };
    }

    const isOnlineList = await call(ctx).isUserOnline(allowedTargetIds);

    await this.listcastNotify(ctx, allowedTargetIds, 'inviteCall', {
      senderUserId,
      roomName,
    });

    return {
      online: allowedTargetIds.filter((_, i) => isOnlineList[i]),
      offline: allowedTargetIds.filter((_, i) => !isOnlineList[i]),
    };
  }

  async webhook(ctx: TcContext) {
    const payload = ctx.params as WebhookEvent;

    if (payload.event === 'participant_joined') {
      const room = payload.room;
      const [groupId, panelId] = room.name.split('#');

      this.roomcastNotify(ctx, groupId, 'participantJoined', {
        groupId,
        panelId,
        participant: payload.participant,
      });

      return;
    } else if (payload.event === 'participant_left') {
      const room = payload.room;
      const [groupId, panelId] = room.name.split('#');

      this.roomcastNotify(ctx, groupId, 'participantLeft', {
        groupId,
        panelId,
        participant: payload.participant,
      });

      return;
    }
  }
}

export default LivekitService;
