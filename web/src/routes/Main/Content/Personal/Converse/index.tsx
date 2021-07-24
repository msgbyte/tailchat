import { ChatBox } from '@/components/ChatBox';
import React from 'react';
import { useParams } from 'react-router';

interface UserConversePanelParams {
  converseId: string;
}

export const ConversePanel: React.FC = React.memo(() => {
  const params = useParams<UserConversePanelParams>();

  return (
    <div className="w-full h-full overflow-hidden">
      <ChatBox converseId={params.converseId} isGroup={false} />
    </div>
  );
});
ConversePanel.displayName = 'ConversePanel';
