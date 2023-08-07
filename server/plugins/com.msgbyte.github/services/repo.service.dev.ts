import type { GroupStruct } from 'tailchat-server-sdk';
import { GroupPanelType, TcContext } from 'tailchat-server-sdk';
import { TcService, TcDbService } from 'tailchat-server-sdk';
import type { RepoDocument, RepoModel } from '../models/repo';

const ACTIVITY_PANEL_NAME = 'Activity';

const defaultGroupPanel = [
  {
    id: '00',
    name: 'Default',
    type: GroupPanelType.GROUP,
  },
  {
    id: '01',
    name: 'Lobby',
    parentId: '00',
    type: GroupPanelType.TEXT,
  },
  {
    id: '02',
    name: ACTIVITY_PANEL_NAME,
    parentId: '00',
    type: GroupPanelType.TEXT,
  },
  {
    id: '10',
    name: 'Project',
    type: GroupPanelType.GROUP,
  },
];

/**
 * Github项目管理服务
 */

interface GithubRepoService
  extends TcService,
    TcDbService<RepoDocument, RepoModel> {}
class GithubRepoService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.github.repo';
  }

  onInit() {
    this.registerLocalDb(require('../models/repo').default);

    this.registerAction('ensure', this.ensure, {
      params: {
        repoName: 'string',
      },
    });
  }

  async ensure(ctx: TcContext<{ repoName: string }>): Promise<{
    repoName: string;
    groupId: string;
  }> {
    const { repoName } = ctx.params;

    let doc = await this.adapter.model.findOne({
      repoName,
    });

    if (!doc) {
      // 不存在
      const group = await this.systemCall<GroupStruct>(
        ctx,
        'group.createGroup',
        {
          name: repoName,
          panels: defaultGroupPanel,
        }
      );
      const groupId = String(group._id);
      const activityPanel = group.panels.find(
        (item) => item.name === ACTIVITY_PANEL_NAME
      );
      if (activityPanel) {
        await this.systemCall(ctx, 'plugin:com.msgbyte.github.subscribe.add', {
          groupId,
          textPanelId: activityPanel.id,
          repoName,
        });
      }

      doc = await this.adapter.model.create({
        repoName,
        groupId,
      });
    }

    const json = await this.transformDocuments(ctx, {}, doc);

    return json;
  }
}

export default GithubRepoService;
