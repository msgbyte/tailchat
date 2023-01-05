import { UserAvatar, UserName } from '@capital/component';
import { AgoraVideoPlayer, IAgoraRTCRemoteUser } from 'agora-rtc-react';
import React from 'react';
import styled from 'styled-components';
import { useClient } from './client';
import { useMeetingStore } from './store';
import { getClientLocalTrack } from './utils';

const Root = styled.div<{
  active?: boolean;
}>`
  width: 95%;
  height: auto;
  position: relative;
  background-color: #333;
  border-radius: 10px;
  aspect-ratio: 16/9;
  justify-self: center;
  align-self: center;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  border-width: 3px;
  border-color: ${(props) => (props.active ? '#7ab157;' : 'transparent')};
  transition: border-color 0.2s;

  .player {
    width: 100%;
    height: 100%;
  }

  .name {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 4px 8px;
  }
`;

export const VideoView: React.FC<{
  user: IAgoraRTCRemoteUser;
}> = (props) => {
  const user = props.user;
  const active = useVolumeActive(String(user.uid));

  return (
    <Root active={active}>
      {user.hasVideo ? (
        <AgoraVideoPlayer className="player" videoTrack={user.videoTrack} />
      ) : (
        <UserAvatar size={96} userId={String(user.uid)} />
      )}

      <UserName className="name" userId={String(user.uid)} />
    </Root>
  );
};
VideoView.displayName = 'VideoView';

export const OwnVideoView: React.FC<{}> = React.memo(() => {
  const client = useClient();
  const mediaPerm = useMeetingStore((state) => state.mediaPerm);
  const active = useVolumeActive(String(client.uid));

  if (!client.uid) {
    return null;
  }

  const videoTrack = getClientLocalTrack(client, 'video');

  return (
    <Root active={active}>
      {mediaPerm.video ? (
        <AgoraVideoPlayer className="player" videoTrack={videoTrack} />
      ) : (
        <UserAvatar size={96} userId={String(client.uid)} />
      )}

      <UserName className="name" userId={String(client.uid)} />
    </Root>
  );
});
OwnVideoView.displayName = 'OwnVideoView';

function useVolumeActive(uid: string) {
  const volume = useMeetingStore((state) =>
    state.volumes.find((v) => v.uid === uid)
  );
  const volumeLevel = volume?.level ?? 0;

  return volumeLevel >= 60;
}
