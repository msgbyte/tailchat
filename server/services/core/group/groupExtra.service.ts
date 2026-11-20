import _ from 'lodash';
import type {
  GroupExtraDocument,
  GroupExtraModel,
} from '../../../models/group/group-extra';
import {
  TcService,
  TcContext,
  TcDbService,
  call,
  PERMISSION,
  t,
  DataNotFoundError,
  NoPermissionError,
  SYSTEM_USERID,
} from 'tailchat-server-sdk';
import { auditLogMixin } from '../../../lib/auditLog';

interface GroupExtraService
  extends TcService,
    TcDbService<GroupExtraDocument, GroupExtraModel> {}
class GroupExtraService extends TcService {
  get serviceName(): string {
    return 'group.extra';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/group/group-extra').default);
    this.registerMixin(auditLogMixin(['saveGroupData', 'savePanelData']));

    this.registerAction('getGroupData', this.getGroupData, {
      params: {
        groupId: 'string',
        name: 'string',
      },
    });
    this.registerAction('getGroupDataInternal', this.getGroupDataInternal, {
      visibility: 'public',
      params: {
        groupId: 'string',
        name: 'string',
      },
      cache: {
        keys: ['groupId', 'name'],
        ttl: 60 * 60, // 1 hour
      },
    });
    this.registerAction('saveGroupData', this.saveGroupData, {
      params: {
        groupId: 'string',
        name: 'string',
        data: 'string',
      },
    });
    this.registerAction('getPanelData', this.getPanelData, {
      params: {
        groupId: 'string',
        panelId: 'string',
        name: 'string',
      },
    });
    this.registerAction('getPanelDataInternal', this.getPanelDataInternal, {
      visibility: 'public',
      params: {
        groupId: 'string',
        panelId: 'string',
        name: 'string',
      },
      cache: {
        keys: ['groupId', 'panelId', 'name'],
        ttl: 60 * 60, // 1 hour
      },
    });
    this.registerAction('savePanelData', this.savePanelData, {
      params: {
        groupId: 'string',
        panelId: 'string',
        name: 'string',
        data: 'string',
      },
    });
  }

  private async ensureGroupMember(
    ctx: TcContext,
    groupId: string,
    panelId?: string
  ) {
    const userId = ctx.meta.userId;
    const translate = ctx.meta.t ?? t;
    const groupInfo = await call(ctx).getGroupInfo(groupId);
    if (!groupInfo) {
      throw new DataNotFoundError(translate('群组未找到'));
    }

    if (
      userId !== SYSTEM_USERID &&
      !groupInfo.members.some((m) => String(m.userId) === String(userId))
    ) {
      throw new NoPermissionError(translate('没有查看权限'));
    }

    if (
      panelId !== undefined &&
      !groupInfo.panels.some((p) => String(p.id) === String(panelId))
    ) {
      throw new DataNotFoundError(translate('没有找到该面板'));
    }
  }

  async getGroupData(
    ctx: TcContext<{
      groupId: string;
      name: string;
    }>
  ) {
    const { groupId, name } = ctx.params;

    await this.ensureGroupMember(ctx, groupId);

    return this.localCall('getGroupDataInternal', { groupId, name });
  }

  async getGroupDataInternal(
    ctx: TcContext<{
      groupId: string;
      name: string;
    }>
  ) {
    const { groupId, name } = ctx.params;

    const res = await this.adapter.findOne({
      groupId,
      panelId: null,
      name,
    });

    return { data: res?.data ?? null };
  }

  async saveGroupData(
    ctx: TcContext<{
      groupId: string;
      name: string;
      data: string;
    }>
  ) {
    const { groupId, name, data } = ctx.params;
    const userId = ctx.meta.userId;

    const [hasPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION.core.groupConfig]
    );
    if (!hasPermission) {
      throw new NoPermissionError(t('没有操作权限'));
    }

    await this.adapter.model.findOneAndUpdate(
      {
        groupId,
        panelId: null,
        name,
      },
      {
        data: String(data),
      },
      {
        upsert: true, // Create if not exist
      }
    );

    await this.cleanGroupDataCache(groupId, name);

    return true;
  }

  async getPanelData(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      name: string;
    }>
  ) {
    const { groupId, panelId, name } = ctx.params;

    await this.ensureGroupMember(ctx, groupId, panelId);

    return this.localCall('getPanelDataInternal', { groupId, panelId, name });
  }

  async getPanelDataInternal(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      name: string;
    }>
  ) {
    const { groupId, panelId, name } = ctx.params;

    const res = await this.adapter.findOne({
      groupId,
      panelId,
      name,
    });

    return { data: res?.data ?? null };
  }

  async savePanelData(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      name: string;
      data: string;
    }>
  ) {
    const { groupId, panelId, name, data } = ctx.params;
    const userId = ctx.meta.userId;
    const translate = ctx.meta.t ?? t;

    const [hasPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION.core.managePanel]
    );
    if (!hasPermission) {
      throw new NoPermissionError(translate('没有操作权限'));
    }

    const groupInfo = await call(ctx).getGroupInfo(groupId);
    if (!groupInfo?.panels.some((p) => String(p.id) === String(panelId))) {
      throw new DataNotFoundError(translate('没有找到该面板'));
    }

    await this.adapter.model.findOneAndUpdate(
      {
        groupId,
        panelId,
        name,
      },
      {
        data: String(data),
      },
      {
        upsert: true, // Create if not exist
      }
    );

    await this.cleanGroupPanelDataCache(groupId, panelId, name);

    return true;
  }

  private cleanGroupDataCache(groupId: string, name: string) {
    return this.cleanActionCache('getGroupDataInternal', [groupId, name]);
  }

  private cleanGroupPanelDataCache(
    groupId: string,
    panelId: string,
    name: string
  ) {
    return this.cleanActionCache('getPanelDataInternal', [
      groupId,
      panelId,
      name,
    ]);
  }
}

export default GroupExtraService;
