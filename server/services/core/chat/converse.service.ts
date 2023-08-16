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
} from 'tailchat-server-sdk';
import type {
  ConverseDocument,
  ConverseModel,
} from '../../../models/chat/converse';

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
          memberIds: 'array',
        },
      }
    );
    this.registerAction('findConverseInfo', this.findConverseInfo, {
      params: {
        converseId: 'string',
      },
    });
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
      converse = await this.adapter.model.create({
        type: 'Multi',
        members: participantList.map((id) => new Types.ObjectId(id)),
      });
    }

    const roomId = String(converse._id);
    await Promise.all(
      participantList.map((memberId) =>
        call(ctx).joinSocketIORoom([roomId], memberId)
      )
    );

    // 广播更新消息
    await this.roomcastNotify(
      ctx,
      roomId,
      'updateDMConverse',
      converse.toJSON()
    );

    // 更新dmlist 异步处理
    Promise.all(
      participantList.map(async (memberId) => {
        try {
          await ctx.call(
            'user.dmlist.addConverse',
            { converseId: roomId },
            {
              meta: {
                userId: memberId,
              },
            }
          );
        } catch (e) {
          this.logger.error(e);
        }
      })
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
    const { converseId, memberIds } = ctx.params;

    const converse = await this.adapter.model.findById(converseId);
    if (!converse) {
      throw new DataNotFoundError();
    }

    if (!converse.members.map(String).includes(userId)) {
      throw new Error('不是会话参与者, 无法添加成员');
    }

    converse.members.push(...memberIds.map((uid) => new Types.ObjectId(uid)));
    await converse.save();

    await Promise.all(
      memberIds.map((uid) =>
        call(ctx).joinSocketIORoom([String(converseId)], uid)
      )
    );

    // 广播更新会话列表
    await this.roomcastNotify(
      ctx,
      converseId,
      'updateDMConverse',
      converse.toJSON()
    );

    // 更新dmlist 异步处理
    Promise.all(
      memberIds.map(async (memberId) => {
        try {
          await ctx.call(
            'user.dmlist.addConverse',
            { converseId },
            {
              meta: {
                userId: memberId,
              },
            }
          );
        } catch (e) {
          this.logger.error(e);
        }
      })
    );

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

    const memebers = converse.members ?? [];
    if (!memebers.map((member) => String(member)).includes(userId)) {
      throw new NoPermissionError(t('没有获取会话信息权限'));
    }

    return await this.transformDocuments(ctx, {}, converse);
  }

  /**
   * 查找用户相关的所有会话并加入房间
   * @returns 返回相关信息
   */
  async findAndJoinRoom(ctx: TcContext) {
    const userId = ctx.meta.userId;
    const dmConverseIds = await this.adapter.model.findAllJoinedConverseId(
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

    return {
      dmConverseIds,
      groupIds,
      textPanelIds,
      subscribeFeaturePanelIds,
    };
  }
}

export default ConverseService;
