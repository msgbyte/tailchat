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

export const GroupPanelRender: React.FC = React.memo(() => {
  const { groupId, panelId } = useGroupPanelParams();
  const groupInfo = useGroupInfo(groupId);
  const panelInfo = useGroupPanel(groupId, panelId);

  if (groupInfo === null) {
    return null;
  }

  if (panelInfo === null) {
    return null;
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
});
GroupPanelRender.displayName = 'GroupPanelRender';
