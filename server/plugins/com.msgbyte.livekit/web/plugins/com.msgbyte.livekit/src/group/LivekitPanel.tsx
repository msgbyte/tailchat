import {
  showErrorToasts,
  useEvent,
  useGroupPanelContext,
} from '@capital/common';
import { GroupPanelContainer } from '@capital/component';
import React, { useState } from 'react';
import type { LocalUserChoices } from '@livekit/components-react';
import { PreJoinView } from '../components/PreJoinView';
import { LivekitContainer } from '../components/LivekitContainer';
import { ActiveRoom } from '../components/ActiveRoom';
import { useLivekitState } from '../store/useLivekitState';

export const LivekitPanel: React.FC = React.memo(() => {
  const { groupId, panelId } = useGroupPanelContext();
  const [preJoinChoices, setPreJoinChoices] = useState<
    LocalUserChoices | undefined
  >(undefined);
  const { setActive, setDeactive } = useLivekitState();

  const handleError = useEvent((err: Error) => {
    showErrorToasts('error while setting up prejoin');
    console.log('error while setting up prejoin', err);
  });

  const handleJoin = useEvent((userChoices: LocalUserChoices) => {
    setPreJoinChoices(userChoices);
    setActive(`/main/group/${groupId}/${panelId}`);
  });

  const handleLeave = useEvent(() => {
    setPreJoinChoices(undefined);
    setDeactive();
  });

  const roomName = `${groupId}#${panelId}`;

  return (
    <GroupPanelContainer groupId={groupId} panelId={panelId}>
      <LivekitContainer>
        {roomName && preJoinChoices ? (
          <ActiveRoom
            roomName={roomName}
            userChoices={preJoinChoices}
            onLeave={handleLeave}
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
              onSubmit={handleJoin}
            />
          </div>
        )}
      </LivekitContainer>
    </GroupPanelContainer>
  );
});
LivekitPanel.displayName = 'LivekitPanel';

export default LivekitPanel;
