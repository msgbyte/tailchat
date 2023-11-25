import { showErrorToasts, useEvent } from '@capital/common';
import { withKeepAliveOverlay } from '@capital/component';
import React, { useState } from 'react';
import type { LocalUserChoices } from '@livekit/components-react';
import { PreJoinView } from './lib/PreJoinView';
import { LivekitContainer } from './LivekitContainer';
import { ActiveRoom } from './ActiveRoom';
import { useLivekitState } from '../store/useLivekitState';

interface LivekitViewProps {
  roomName: string;
  url: string;
  autoInviteIds?: string[];
}
const _LivekitView: React.FC<LivekitViewProps> = React.memo((props) => {
  const { setActive, setDeactive } = useLivekitState();

  const handleJoin = useEvent(async () => {
    await setDeactive(); // 先退出之前的房间
    setActive(props.url);
  });

  const handleLeave = useEvent(() => {
    setDeactive();
  });

  return (
    <PureLivekitView
      roomName={props.roomName}
      autoInviteIds={props.autoInviteIds}
      onJoin={handleJoin}
      onLeave={handleLeave}
    />
  );
});
_LivekitView.displayName = 'LivekitView';

export const LivekitView = withKeepAliveOverlay(_LivekitView, {
  cacheId: (props) => props.url,
});

interface PureLivekitViewProps {
  roomName: string;
  autoInviteIds?: string[];
  onJoin?: () => Promise<void>;
  onLeave?: () => void;
}
/**
 * Without context just for meeting view
 */
export const PureLivekitView: React.FC<PureLivekitViewProps> = React.memo(
  (props) => {
    const [preJoinChoices, setPreJoinChoices] = useState<
      LocalUserChoices | undefined
    >(undefined);

    const handleError = useEvent((err: Error) => {
      showErrorToasts('error while setting up prejoin');
      console.log('error while setting up prejoin', err);
    });

    const handleJoin = useEvent(async (userChoices: LocalUserChoices) => {
      await props.onJoin?.();

      setPreJoinChoices(userChoices);
    });

    const handleLeave = useEvent(() => {
      props.onLeave?.();
      setPreJoinChoices(undefined);
    });

    return (
      <LivekitContainer>
        {props.roomName && preJoinChoices ? (
          <ActiveRoom
            roomName={props.roomName}
            userChoices={preJoinChoices}
            autoInviteIds={props.autoInviteIds}
            onLeave={handleLeave}
          />
        ) : (
          <div
            style={{ display: 'grid', placeItems: 'center', height: '100%' }}
          >
            <PreJoinView
              roomName={props.roomName}
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
  }
);
PureLivekitView.displayName = 'PureLivekitView';
