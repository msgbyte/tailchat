import { UserAvatar, UserName } from '@capital/component';
import { AgoraVideoPlayer, IAgoraRTCRemoteUser } from 'agora-rtc-react';
import React from 'react';
import styled from 'styled-components';
import { useClient, useMicrophoneAndCameraTracks } from './client';
import { useMeetingStore } from './store';

const Root = styled.div`
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

  return (
    <Root>
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
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const client = useClient();
  const mediaPerm = useMeetingStore((state) => state.mediaPerm);

  return (
    <Root>
      {ready && mediaPerm.video ? (
        <AgoraVideoPlayer className="player" videoTrack={tracks[1]} />
      ) : (
        <UserAvatar size={96} userId={String(client.uid)} />
      )}

      <UserName className="name" userId={String(client.uid)} />
    </Root>
  );
});
OwnVideoView.displayName = 'OwnVideoView';
