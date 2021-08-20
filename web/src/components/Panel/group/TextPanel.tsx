import { ChatBox } from '@/components/ChatBox';
import React from 'react';
import { useGroupPanel } from 'tailchat-shared';
import { GroupPanelWrapper } from './Wrapper';

interface TextPanelProps {
  groupId: string;
  panelId: string;
}
export const TextPanel: React.FC<TextPanelProps> = React.memo(
  ({ groupId, panelId }) => {
    const panelInfo = useGroupPanel(groupId, panelId);
    if (panelInfo === undefined) {
      return null;
    }

    return (
      <GroupPanelWrapper groupId={groupId} panelId={panelId}>
        <ChatBox converseId={panelId} isGroup={true} groupId={groupId} />
      </GroupPanelWrapper>
    );
  }
);
TextPanel.displayName = 'TextPanel';
