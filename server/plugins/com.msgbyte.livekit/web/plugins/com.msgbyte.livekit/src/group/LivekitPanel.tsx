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
import { ActiveRoom } from '../components/ActiveRoom';

export const LivekitPanel: React.FC = React.memo(() => {
  const { groupId, panelId } = useGroupPanelContext();
  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >(undefined);

  const handleError = useEvent((err: Error) => {
    showErrorToasts('error while setting up prejoin');
    console.log('error while setting up prejoin', err);
  });

  const roomName = `${groupId}#${panelId}`;

  return (
    <GroupPanelContainer groupId={groupId} panelId={panelId}>
      <LivekitContainer>
        {roomName && preJoinChoices ? (
          <ActiveRoom
            roomName={roomName}
            userChoices={preJoinChoices}
            onLeave={() => {
              setPreJoinChoices(undefined);
            }}
          />
        ) : (
          <div
            style={{ display: 'grid', placeItems: 'center', height: '100%' }}
          >
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
        )}
      </LivekitContainer>
    </GroupPanelContainer>
  );
});
LivekitPanel.displayName = 'LivekitPanel';

export default LivekitPanel;
