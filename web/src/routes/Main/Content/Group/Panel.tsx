import { TextPanel } from '@/components/Panel/group/TextPanel';
import { Alert } from 'antd';
import React from 'react';
import { useParams } from 'react-router';
import { GroupPanelType, useGroupPanel } from 'tailchat-shared';

export const GroupPanelRender: React.FC = React.memo(() => {
  const { groupId, panelId } = useParams<{
    groupId: string;
    panelId: string;
  }>();

  const panelInfo = useGroupPanel(groupId, panelId);

  if (panelInfo === undefined) {
    return null;
  }

  if (panelInfo.type === GroupPanelType.TEXT) {
    return <TextPanel panelId={panelInfo.id} />;
  }

  return <Alert message="未知的面板类型" />;
});
GroupPanelRender.displayName = 'GroupPanelRender';
