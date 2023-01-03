import React from 'react';
import styled from 'styled-components';
import { useMeetingStore } from './store';
import { OwnVideoView, VideoView } from './VideoView';

const Root = styled.div`
  height: 70vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
`;

export const Videos: React.FC = React.memo(() => {
  const users = useMeetingStore((state) => state.users);

  return (
    <Root>
      <OwnVideoView />

      {users.length > 0 &&
        users.map((user) => {
          return <VideoView key={user.uid} user={user} />;
        })}
    </Root>
  );
});
Videos.displayName = 'Videos';
