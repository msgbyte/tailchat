import { ChatBox } from '@/components/ChatBox';
import React from 'react';

interface TextPanelProps {
  panelId: string;
}
export const TextPanel: React.FC<TextPanelProps> = React.memo(({ panelId }) => {
  // return <ChatBox converseId={panelId} />;
  return <div>TODO: panelId: {panelId}</div>;
});
TextPanel.displayName = 'TextPanel';
