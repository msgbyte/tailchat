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
  NoPermissionError,
} from 'tailchat-server-sdk';

interface GroupExtraService
  extends TcService,
    TcDbService<GroupExtraDocument, GroupExtraModel> {}
class GroupExtraService extends TcService {
  get serviceName(): string {
    return 'group.extra';
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/group/group-extra').default);

    this.registerAction('getPanelData', this.getPanelData, {
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

  async getPanelData(
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

    const [hasPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION.core.managePanel]
    );
    if (!hasPermission) {
      throw new NoPermissionError(t('没有操作权限'));
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

  private cleanGroupPanelDataCache(
    groupId: string,
    panelId: string,
    name: string
  ) {
    return this.cleanActionCache('getPanelData', [groupId, panelId, name]);
  }
}

export default GroupExtraService;
