import { useGroupPanelContext } from '@capital/common';
import { GroupPanelContainer } from '@capital/component';
import React from 'react';
import { LivekitView } from '../components/LivekitView';

export const LivekitGroupPanel: React.FC = React.memo(() => {
  const { groupId, panelId } = useGroupPanelContext();
  const roomName = `${groupId}#${panelId}`;
  const url = `/main/group/${groupId}/${panelId}`;

  return (
    <GroupPanelContainer groupId={groupId} panelId={panelId}>
      <LivekitView
        style={{ width: '100%', height: '100%' }}
        roomName={roomName}
        url={url}
      />
    </GroupPanelContainer>
  );
});
LivekitGroupPanel.displayName = 'LivekitGroupPanel';

export default LivekitGroupPanel;
