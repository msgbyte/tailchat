import { showErrorToasts, useEvent } from '@capital/common';
import React, { useState } from 'react';
import type { LocalUserChoices } from '@livekit/components-react';
import { PreJoinView } from './lib/PreJoinView';
import { LivekitContainer } from './LivekitContainer';
import { ActiveRoom } from './ActiveRoom';
import { useLivekitState } from '../store/useLivekitState';

interface LivekitViewProps {
  roomName: string;
  url: string;
}
export const LivekitView: React.FC<LivekitViewProps> = React.memo((props) => {
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
    setActive(props.url);
  });

  const handleLeave = useEvent(() => {
    setPreJoinChoices(undefined);
    setDeactive();
  });

  return (
    <LivekitContainer>
      {props.roomName && preJoinChoices ? (
        <ActiveRoom
          roomName={props.roomName}
          userChoices={preJoinChoices}
          onLeave={handleLeave}
        />
      ) : (
        <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
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
  );
});
LivekitView.displayName = 'LivekitView';
