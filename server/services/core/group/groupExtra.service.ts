import _ from 'lodash';
import type {
  GroupExtraDocument,
  GroupExtraModel,
} from '../../../models/group/group-extra';
import { TcService, TcContext, TcDbService } from 'tailchat-server-sdk';

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

    return res?.data ?? null;
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

    await this.adapter.model.findOneAndUpdate(
      {
        groupId,
        panelId,
        name,
      },
      {
        data: String(data),
      }
    );

    return true;
  }
}

export default GroupExtraService;
