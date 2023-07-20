import {
  showErrorToasts,
  useEvent,
  useGroupPanelContext,
} from '@capital/common';
import { GroupPanelContainer } from '@capital/component';
import React, { useState } from 'react';
import {
  LiveKitRoom,
  LocalUserChoices,
  useToken,
  VideoConference,
  formatChatMessageLinks,
} from '@livekit/components-react';
import { LogLevel, RoomOptions, VideoPresets } from 'livekit-client';
import { PreJoinView } from '../components/PreJoinView';
import { LivekitContainer } from '../components/LivekitContainer';

export const LivekitPanel: React.FC = React.memo(() => {
  const { groupId, panelId } = useGroupPanelContext();
  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >(undefined);

  const handleError = useEvent((err: Error) => {
    showErrorToasts('error while setting up prejoin');
    console.log('error while setting up prejoin', err);
  });

  return (
    <GroupPanelContainer groupId={groupId} panelId={panelId}>
      <LivekitContainer>
        <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
          <PreJoinView
            onError={handleError}
            defaults={{
              videoEnabled: false,
              audioEnabled: false,
            }}
            onSubmit={(values) => {
              console.log('Joining with: ', values);
              setPreJoinChoices(values);
            }}
          />
        </div>
      </LivekitContainer>
    </GroupPanelContainer>
  );
});
LivekitPanel.displayName = 'LivekitPanel';

export default LivekitPanel;
