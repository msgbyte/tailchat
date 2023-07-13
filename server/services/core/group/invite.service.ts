import _ from 'lodash';
import type {
  GroupInvite,
  GroupInviteDocument,
  GroupInviteModel,
} from '../../../models/group/invite';
import {
  TcService,
  TcContext,
  TcDbService,
  PureContext,
  call,
  NoPermissionError,
  PERMISSION,
  db,
} from 'tailchat-server-sdk';

interface GroupService
  extends TcService,
    TcDbService<GroupInviteDocument, GroupInviteModel> {}
class GroupService extends TcService {
  get serviceName(): string {
    return 'group.invite';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/group/invite').default);

    this.registerAction('createGroupInvite', this.createGroupInvite, {
      params: {
        groupId: 'string',
        inviteType: { type: 'enum', values: ['normal', 'permanent'] },
      },
    });
    this.registerAction('editGroupInvite', this.editGroupInvite, {
      params: {
        code: 'string',
        groupId: 'string',
        expiredAt: { type: 'number', optional: true },
        usageLimit: { type: 'number', optional: true },
      },
    });
    this.registerAction('getAllGroupInviteCode', this.getAllGroupInviteCode, {
      params: {
        groupId: 'string',
      },
    });
    this.registerAction('findInviteByCode', this.findInviteByCode, {
      params: {
        code: 'string',
      },
    });
    this.registerAction('applyInvite', this.applyInvite, {
      params: {
        code: 'string',
      },
    });
    this.registerAction('deleteInvite', this.deleteInvite, {
      params: {
        groupId: 'string',
        inviteId: 'string',
      },
    });
  }

  /**
   * 创建群组邀请
   */
  async createGroupInvite(
    ctx: TcContext<{
      groupId: string;
      inviteType: 'normal' | 'permanent';
    }>
  ): Promise<GroupInvite> {
    const { groupId, inviteType } = ctx.params;
    const { userId, t } = ctx.meta;

    const [hasNormalPermission, hasUnlimitedPermission] = await call(
      ctx
    ).checkUserPermissions(groupId, userId, [
      PERMISSION.core.invite,
      PERMISSION.core.unlimitedInvite,
    ]);

    if (
      (inviteType === 'normal' && !hasNormalPermission) ||
      (inviteType === 'permanent' && !hasUnlimitedPermission)
    ) {
      throw new NoPermissionError(t('没有创建邀请码权限'));
    }

    const invite = await this.adapter.model.createGroupInvite(
      groupId,
      userId,
      inviteType
    );
    return await this.transformDocuments(ctx, {}, invite);
  }

  /**
   * 编辑群组邀请码
   */
  async editGroupInvite(
    ctx: TcContext<{
      code: string;
      groupId: string;
      expiredAt?: number; // 时间戳，单位ms
      usageLimit?: number;
    }>
  ) {
    const { code, groupId, expiredAt, usageLimit } = ctx.params;
    const { userId, t } = ctx.meta;

    // 检查权限
    const [hasEditPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION.core.editInvite]
    );

    if (!hasEditPermission) {
      throw new NoPermissionError(t('没有编辑邀请码权限'));
    }

    const update = {};
    if (expiredAt) {
      _.set(update, ['expiredAt'], new Date(expiredAt));
    } else {
      _.set(update, ['$unset', 'expiredAt'], 1);
    }

    if (usageLimit) {
      _.set(update, ['usageLimit'], usageLimit);
    } else {
      _.set(update, ['$unset', 'usageLimit'], 1);
    }

    await this.adapter.model.updateOne({ groupId, code }, update);

    return true;
  }

  /**
   * 获取所有群组邀请码
   */
  async getAllGroupInviteCode(
    ctx: TcContext<{
      groupId: string;
    }>
  ) {
    const groupId = ctx.params.groupId;
    const { t, userId } = ctx.meta;

    const [hasPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION.core.manageInvite]
    );
    if (!hasPermission) {
      throw new NoPermissionError(t('没有查看权限'));
    }

    const list = await this.adapter.model.find({
      groupId,
    });

    return await this.transformDocuments(ctx, {}, list);
  }

  /**
   * 通过邀请码查找群组邀请信息
   */
  async findInviteByCode(
    ctx: PureContext<{
      code: string;
    }>
  ): Promise<GroupInvite | null> {
    const code = ctx.params.code;

    const invite = await this.adapter.model.findOne({
      code,
    });

    return await this.transformDocuments(ctx, {}, invite);
  }

  /**
   * 应用群组邀请(通过群组邀请加入群组)
   */
  async applyInvite(ctx: TcContext<{ code: string }>): Promise<void> {
    const code = ctx.params.code;
    const t = ctx.meta.t;

    const invite = await this.adapter.model.findOne({
      code,
    });

    if (typeof invite.usageLimit === 'number') {
      const usage = invite.usage || 0;
      if (usage >= invite.usageLimit) {
        throw new Error(t('该邀请码使用次数耗尽'));
      }
    }

    if (new Date(invite.expiredAt).valueOf() < Date.now()) {
      throw new Error(t('该邀请码已过期'));
    }

    const groupId = invite.groupId;
    if (_.isNil(groupId)) {
      throw new Error(t('群组邀请失效: 群组id为空'));
    }

    await ctx.call('group.joinGroup', {
      groupId: String(groupId),
    });

    await this.adapter.model.updateOne(
      {
        _id: new db.Types.ObjectId(invite._id),
      },
      {
        $inc: {
          usage: 1,
        },
      }
    );

    const creatorInfo = await call(ctx).getUserInfo(String(invite.creator));
    await call(ctx).addGroupSystemMessage(
      String(groupId),
      t('{{nickname}} 通过 {{creator}} 的邀请码加入群组', {
        nickname: ctx.meta.user.nickname,
        creator: creatorInfo.nickname,
      })
    );
  }

  /**
   * 删除邀请码
   */
  async deleteInvite(ctx: TcContext<{ groupId: string; inviteId: string }>) {
    const groupId = ctx.params.groupId;
    const inviteId = ctx.params.inviteId;
    const { t, userId } = ctx.meta;

    const [hasPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION.core.manageInvite]
    );
    if (!hasPermission) {
      throw new NoPermissionError(t('没有删除权限'));
    }

    await this.adapter.model.deleteOne({
      _id: inviteId,
      groupId,
    });
  }
}

export default GroupService;
