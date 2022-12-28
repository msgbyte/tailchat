import { IconBtn } from '@capital/component';
import React from 'react';
import { useClient, useMicrophoneAndCameraTracks } from './client';
import { useMeetingStore } from './store';
import { getClientLocalTrack } from './utils';

export const Controls: React.FC<{
  onClose: () => void;
}> = React.memo((props) => {
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const mediaPerm = useMeetingStore((state) => state.mediaPerm);

  const mute = async (type: 'audio' | 'video') => {
    if (type === 'audio') {
      if (mediaPerm.audio === true) {
        const track = getClientLocalTrack(client, 'audio');
        if (track) {
          await client.unpublish(track);
        }
      } else {
        await client.publish(tracks[0]);
      }

      useMeetingStore.getState().setMediaPerm({ audio: !mediaPerm.audio });
    } else if (type === 'video') {
      if (mediaPerm.video === true) {
        const track = getClientLocalTrack(client, 'video');
        if (track) {
          await client.unpublish(track);
        }
      } else {
        await client.publish(tracks[1]);
      }

      useMeetingStore.getState().setMediaPerm({ video: !mediaPerm.video });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    useMeetingStore.getState().reset();
    // we close the tracks to perform cleanup
    tracks[0].close();
    tracks[1].close();
    props.onClose();
  };

  return (
    <div className="controller">
      <IconBtn
        icon={mediaPerm.video ? 'mdi:video' : 'mdi:video-off'}
        title={mediaPerm.video ? '关闭摄像头' : '开启摄像头'}
        disabled={!ready}
        size="large"
        onClick={() => mute('video')}
      />

      <IconBtn
        icon={mediaPerm.audio ? 'mdi:microphone' : 'mdi:microphone-off'}
        title={mediaPerm.audio ? '关闭麦克风' : '开启麦克风'}
        disabled={!ready}
        size="large"
        onClick={() => mute('audio')}
      />

      <IconBtn
        icon="mdi:phone-remove-outline"
        title="挂断"
        danger={true}
        size="large"
        onClick={leaveChannel}
      />
    </div>
  );
});
Controls.displayName = 'Controls';
