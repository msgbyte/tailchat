import { GroupPluginPanel } from '@/components/Panel/group/PluginPanel';
import { TextPanel } from '@/components/Panel/group/TextPanel';
import { Alert } from 'antd';
import React from 'react';
import {
  GroupInfoContextProvider,
  GroupPanelType,
  t,
  useGroupInfo,
  useGroupPanel,
} from 'tailchat-shared';
import { useGroupPanelParams } from './utils';

interface GroupPanelRenderProps {
  groupId: string;
  panelId: string;
}
export const GroupPanelRender: React.FC<GroupPanelRenderProps> = React.memo(
  (props) => {
    const { groupId, panelId } = props;
    const groupInfo = useGroupInfo(groupId);
    const panelInfo = useGroupPanel(groupId, panelId);

    if (groupInfo === null) {
      return (
        <Alert
          className="w-full text-center"
          type="error"
          message={t('群组不存在')}
        />
      );
    }

    if (panelInfo === null) {
      return (
        <Alert
          className="w-full text-center"
          type="error"
          message={t('面板不存在')}
        />
      );
    }

    if (panelInfo.type === GroupPanelType.TEXT) {
      return (
        <GroupInfoContextProvider groupInfo={groupInfo}>
          <TextPanel groupId={groupId} panelId={panelInfo.id} />
        </GroupInfoContextProvider>
      );
    } else if (panelInfo.type === GroupPanelType.PLUGIN) {
      return <GroupPluginPanel groupId={groupId} panelId={panelInfo.id} />;
    }

    return (
      <Alert
        className="w-full text-center"
        type="error"
        message={t('未知的面板类型')}
      />
    );
  }
);
GroupPanelRender.displayName = 'GroupPanelRender';

export const GroupPanelRoute: React.FC = React.memo(() => {
  const { groupId, panelId } = useGroupPanelParams();

  return <GroupPanelRender groupId={groupId} panelId={panelId} />;
});
GroupPanelRoute.displayName = 'GroupPanelRoute';
