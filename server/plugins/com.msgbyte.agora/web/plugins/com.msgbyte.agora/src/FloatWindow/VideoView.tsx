import { Icon, UserAvatar, UserName } from '@capital/component';
import { AgoraVideoPlayer, IAgoraRTCRemoteUser } from 'agora-rtc-react';
import React from 'react';
import styled from 'styled-components';
import { Translate } from '../translate';
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
    color: white;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
  }

  .screen-icon {
    width: 96px;
    height: 96px;
    font-size: 96px;
  }
`;

/**
 * 界面Icon
 */
const VideViewIcon: React.FC<{ uid: string }> = React.memo(({ uid }) => {
  if (uid.endsWith('_screen')) {
    // 是屏幕共享
    return (
      <div className="screen-icon">
        <Icon icon="mdi:projector-screen-outline" />
      </div>
    );
  } else {
    return <UserAvatar size={96} userId={uid} />;
  }
});
VideViewIcon.displayName = 'VideViewIcon';

/**
 * 界面名称
 */
const VideViewName: React.FC<{ uid: string }> = React.memo(({ uid }) => {
  if (uid.endsWith('_screen')) {
    const userId = uid.substring(0, uid.length - '_screen'.length);

    return (
      <span className="name">
        <UserName userId={userId} />
        {Translate.someoneScreenName}
      </span>
    );
  } else {
    return <UserName className="name" userId={uid} />;
  }
});
VideViewName.displayName = 'VideViewName';

export const VideoView: React.FC<{
  user: IAgoraRTCRemoteUser;
}> = (props) => {
  const user = props.user;
  const active = useVolumeActive(String(user.uid));

  return (
    <Root active={active}>
      {user.hasVideo && user.videoTrack ? (
        <AgoraVideoPlayer className="player" videoTrack={user.videoTrack} />
      ) : (
        <VideViewIcon uid={String(user.uid)} />
      )}

      <VideViewName uid={String(user.uid)} />
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
        <VideViewIcon uid={String(client.uid)} />
      )}

      <VideViewName uid={String(client.uid)} />
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
