import _ from 'lodash';
import { Types } from 'mongoose';
import {
  TcDbService,
  TcService,
  TcContext,
  UserStruct,
  call,
  DataNotFoundError,
  NoPermissionError,
  SYSTEM_USERID,
} from 'tailchat-server-sdk';
import type {
  ConverseDocument,
  ConverseModel,
} from '../../../models/chat/converse';
import type { UserSettings } from '../../../models/user/user';

interface ConverseService
  extends TcService,
    TcDbService<ConverseDocument, ConverseModel> {}
class ConverseService extends TcService {
  get serviceName(): string {
    return 'chat.converse';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/chat/converse').default);

    this.registerAction('createDMConverse', this.createDMConverse, {
      params: {
        /**
         * 创建私人会话的参与者ID列表
         */
        memberIds: { type: 'array', items: 'string' },
      },
    });
    this.registerAction(
      'appendDMConverseMembers',
      this.appendDMConverseMembers,
      {
        params: {
          converseId: 'string',
          memberIds: { type: 'array', items: 'string' },
        },
      }
    );
    this.registerAction('leaveDMConverse', this.leaveDMConverse, {
      params: { converseId: 'string' },
    });
    this.registerAction('findConverseInfo', this.findConverseInfo, {
      params: {
        converseId: 'string',
      },
    });
    this.registerAction(
      'syncConverseMember',
      (ctx: TcContext<{ converseId: string }>) =>
        this.syncConverseMember(ctx, ctx.params.converseId, ctx.meta.userId),
      {
        visibility: 'public',
        disableSocket: true,
        params: { converseId: 'string' },
      }
    );
    this.registerAction('findAndJoinRoom', this.findAndJoinRoom);
  }

  async createDMConverse(ctx: TcContext<{ memberIds: string[] }>) {
    const userId = ctx.meta.userId;
    const memberIds = ctx.params.memberIds;
    const t = ctx.meta.t;

    const participantList = _.uniq([userId, ...memberIds]);

    if (participantList.length < 2) {
      throw new Error(t('成员数异常，无法创建会话'));
    }

    let converse: ConverseDocument;
    if (participantList.length === 2) {
      // 私信会话
      converse = await this.adapter.model.findConverseWithMembers(
        participantList
      );
      if (converse === null) {
        // 创建新的会话
        converse = await this.adapter.model.create({
          type: 'DM',
          members: participantList.map((id) => new Types.ObjectId(id)),
        });
      }
    }

    if (participantList.length > 2) {
      // 多人会话
      await this.checkInvitationPreferences(ctx, participantList);
      converse = await this.adapter.model.create({
        type: 'Multi',
        members: participantList.map((id) => new Types.ObjectId(id)),
      });
    }

    const roomId = String(converse._id);
    await Promise.all(
      participantList.map((memberId) =>
        this.syncConverseMember(ctx, roomId, memberId)
      )
    );

    if (participantList.length > 2) {
      // 如果创建的是一个多人会话(非双人), 发送系统消息
      await Promise.all(
        _.without(participantList, userId).map<Promise<UserStruct>>(
          (memberId) => call(ctx).getUserInfo(memberId)
        )
      ).then((infoList) => {
        return call(ctx).sendSystemMessage(
          t('{{user}} 邀请 {{others}} 加入会话', {
            user: ctx.meta.user.nickname,
            others: infoList.map((info) => info.nickname).join(', '),
          }),
          roomId
        );
      });
    }

    return await this.transformDocuments(ctx, {}, converse);
  }

  /**
   * 在多人会话中添加成员
   */
  async appendDMConverseMembers(
    ctx: TcContext<{ converseId: string; memberIds: string[] }>
  ) {
    const userId = ctx.meta.userId;
    const { converseId } = ctx.params;
    const current = await this.adapter.model.findById(converseId);
    if (!current) {
      throw new DataNotFoundError();
    }
    if (
      current.type !== 'Multi' ||
      !current.members.map(String).includes(userId)
    ) {
      throw new NoPermissionError(ctx.meta.t('没有当前会话权限'));
    }

    const requestedMemberIds = _.uniq(ctx.params.memberIds);
    const memberIds = _.difference(
      requestedMemberIds,
      current.members.map(String)
    );
    await this.checkInvitationPreferences(ctx, memberIds);
    const converse = await this.adapter.model.findOneAndUpdate(
      { _id: converseId, type: 'Multi', members: new Types.ObjectId(userId) },
      {
        $addToSet: {
          members: { $each: memberIds.map((id) => new Types.ObjectId(id)) },
        },
      },
      { new: true }
    );
    if (!converse) {
      throw new NoPermissionError(ctx.meta.t('没有当前会话权限'));
    }

    await Promise.all(
      requestedMemberIds.map((id) =>
        this.syncConverseMember(ctx, converseId, id)
      )
    );
    await this.roomcastNotify(
      ctx,
      converseId,
      'updateDMConverse',
      (await this.adapter.model.findById(converseId)).toJSON()
    );

    if (memberIds.length === 0) {
      return converse;
    }

    // 发送系统消息, 异步处理
    await Promise.all(
      memberIds.map<Promise<UserStruct>>((memberId) =>
        ctx.call('user.getUserInfo', { userId: memberId })
      )
    ).then((infoList) => {
      return call(ctx).sendSystemMessage(
        `${ctx.meta.user.nickname} 邀请 ${infoList
          .map((info) => info.nickname)
          .join(', ')} 加入会话`,
        converseId
      );
    });

    return converse;
  }

  async leaveDMConverse(ctx: TcContext<{ converseId: string }>) {
    const { converseId } = ctx.params;
    const { userId, t } = ctx.meta;
    const memberId = new Types.ObjectId(userId);
    const converse = await this.adapter.model.findOneAndUpdate(
      { _id: converseId, type: 'Multi', members: memberId },
      { $pull: { members: memberId } },
      { new: true }
    );
    if (!converse) {
      // 已经不是成员(重试或从未加入): 只清理本人的房间和列表, 不通知其他成员
      const current = await this.adapter.model.findById(converseId);
      if (current?.type !== 'Multi') {
        throw new NoPermissionError(t('没有当前会话权限'));
      }
      await this.syncConverseMember(ctx, converseId, userId);
      return true;
    }

    await this.syncConverseMember(ctx, converseId, userId);
    await this.roomcastNotify(
      ctx,
      converseId,
      'updateDMConverse',
      converse.toJSON()
    );
    return true;
  }

  private async checkInvitationPreferences(
    ctx: TcContext,
    memberIds: string[]
  ) {
    const inviterId = ctx.meta.userId;
    await Promise.all(
      _.without(_.uniq(memberIds), inviterId).map(async (memberId) => {
        const settings = await this.broker.call<UserSettings, {}>(
          'user.getUserSettings',
          {},
          {
            meta: { ...ctx.meta, userId: memberId },
          }
        );
        if (settings?.onlyAllowFriendInvite === true) {
          const isFriend = await this.broker.call(
            'friend.checkIsFriend',
            { targetId: inviterId },
            {
              meta: { ...ctx.meta, userId: memberId },
            }
          );
          if (!isFriend) {
            throw new NoPermissionError(
              ctx.meta.t('对方仅允许好友邀请加入多人会话')
            );
          }
        }
      })
    );
  }

  /** Recheck after side effects so a delayed join or leave follows current membership. */
  private async syncConverseMember(
    ctx: TcContext,
    converseId: string,
    userId: string
  ) {
    // ponytail: 每轮处理一次并发的退出/重邀, 超过上限视为异常并失败关闭
    for (let pass = 0; pass < 5; pass++) {
      const converse = await this.adapter.model.findById(converseId);
      const isMember = converse?.members.map(String).includes(userId) ?? false;
      if (isMember) {
        await call(ctx).joinSocketIORoom([converseId], userId);
        try {
          await this.broker.call(
            'user.dmlist.addConverse',
            { converseId },
            { meta: { ...ctx.meta, userId } }
          );
        } catch (error) {
          if (error.code === 403) {
            continue;
          }
          throw error;
        }
        await this.unicastNotify(
          ctx,
          userId,
          'updateDMConverse',
          converse.toJSON()
        );
      } else {
        await call(ctx).leaveSocketIORoom([converseId], userId);
        await this.broker.call(
          'user.dmlist.removeConverse',
          { converseId },
          { meta: { ...ctx.meta, userId } }
        );
        await this.unicastNotify(ctx, userId, 'removeDMConverse', {
          converseId,
        });
      }
      const latest = await this.adapter.model.findById(converseId);
      if (
        (latest?.members.map(String).includes(userId) ?? false) === isMember
      ) {
        return isMember;
      }
    }
    throw new Error(
      `Converse ${converseId} membership of ${userId} did not settle`
    );
  }

  /**
   * 查找会话
   */
  async findConverseInfo(
    ctx: TcContext<{
      converseId: string;
    }>
  ) {
    const converseId = ctx.params.converseId;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    const converse = await this.adapter.findById(converseId);
    if (!converse) {
      throw new DataNotFoundError();
    }

    if (userId !== SYSTEM_USERID) {
      // not system, check permission
      const memebers = converse.members ?? [];
      if (!memebers.map((member) => String(member)).includes(userId)) {
        throw new NoPermissionError(t('没有获取会话信息权限'));
      }
    }

    return await this.transformDocuments(ctx, {}, converse);
  }

  /**
   * 查找用户相关的所有会话并加入房间
   * @returns 返回相关信息
   */
  async findAndJoinRoom(ctx: TcContext) {
    const userId = ctx.meta.userId;
    let dmConverseIds = await this.adapter.model.findAllJoinedConverseId(
      userId
    );

    // 获取群组列表
    const { groupIds, textPanelIds, subscribeFeaturePanelIds } =
      await ctx.call<{
        groupIds: string[];
        textPanelIds: string[];
        subscribeFeaturePanelIds: string[];
      }>('group.getJoinedGroupAndPanelIds');

    await call(ctx).joinSocketIORoom([
      ...dmConverseIds,
      ...groupIds,
      ...textPanelIds,
      ...subscribeFeaturePanelIds,
    ]);

    const currentIds = await this.adapter.model.findAllJoinedConverseId(userId);
    await Promise.all(
      _.difference(dmConverseIds, currentIds).map((id) =>
        this.syncConverseMember(ctx, id, userId)
      )
    );
    dmConverseIds = currentIds;

    return {
      dmConverseIds,
      groupIds,
      textPanelIds,
      subscribeFeaturePanelIds,
    };
  }
}

export default ConverseService;
