import { ChatBox } from '@/components/ChatBox';
import React from 'react';

interface TextPanelProps {
  groupId: string;
  panelId: string;
}
export const TextPanel: React.FC<TextPanelProps> = React.memo(
  ({ groupId, panelId }) => {
    return <ChatBox converseId={panelId} isGroup={true} groupId={groupId} />;
  }
);
TextPanel.displayName = 'TextPanel';
