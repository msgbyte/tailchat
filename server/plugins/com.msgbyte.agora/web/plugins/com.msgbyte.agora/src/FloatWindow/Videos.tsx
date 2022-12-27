import { AgoraVideoPlayer } from 'agora-rtc-react';
import React from 'react';
import styled from 'styled-components';
import { useMicrophoneAndCameraTracks } from './client';
import { useMeetingStore } from './store';
import { VideoView } from './VideoView';

const Root = styled.div`
  height: 70vh;
  /* align-self: flex-start; */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
`;

export const Videos: React.FC = React.memo(() => {
  const users = useMeetingStore((state) => state.users);
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  return (
    <Root>
      {/* AgoraVideoPlayer component takes in the video track to render the stream,
            you can pass in other props that get passed to the rendered div */}
      {ready && <AgoraVideoPlayer className="vid" videoTrack={tracks[1]} />}

      {users.length > 0 &&
        users.map((user) => {
          return <VideoView key={user.uid} user={user} />;
        })}
    </Root>
  );
});
Videos.displayName = 'Videos';
