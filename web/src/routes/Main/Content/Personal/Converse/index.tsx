import { ChatBox } from '@/components/ChatBox';
import React from 'react';
import { useParams } from 'react-router';

interface UserConversePanelParams {
  converseUUID: string;
}

export const ConversePanel: React.FC = React.memo(() => {
  const params = useParams<UserConversePanelParams>();

  return (
    <div className="w-full h-full overflow-hidden">
      <div>{params.converseUUID}</div>
      <ChatBox />
    </div>
  );
});
ConversePanel.displayName = 'ConversePanel';
