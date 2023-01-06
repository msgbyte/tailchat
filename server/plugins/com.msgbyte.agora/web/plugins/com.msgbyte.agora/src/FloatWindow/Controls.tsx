import { useAsyncFn } from '@capital/common';
import { IconBtn } from '@capital/component';
import React from 'react';
import { Translate } from '../translate';
import {
  useClient,
  createMicrophoneAudioTrack,
  createCameraVideoTrack,
} from './client';
import { useMeetingStore } from './store';
import { getClientLocalTrack } from './utils';

export const Controls: React.FC<{
  onClose: () => void;
}> = React.memo((props) => {
  const client = useClient();
  const mediaPerm = useMeetingStore((state) => state.mediaPerm);

  const [{ loading }, mute] = useAsyncFn(
    async (type: 'audio' | 'video') => {
      if (type === 'audio') {
        if (mediaPerm.audio === true) {
          const track = getClientLocalTrack(client, 'audio');
          if (track) {
            await client.unpublish(track);
          }
        } else {
          const track = await createMicrophoneAudioTrack();
          await client.publish(track);
        }

        useMeetingStore.getState().setMediaPerm({ audio: !mediaPerm.audio });
      } else if (type === 'video') {
        if (mediaPerm.video === true) {
          const track = getClientLocalTrack(client, 'video');
          if (track) {
            await client.unpublish(track);
          }
        } else {
          const track = await createCameraVideoTrack();
          await client.publish(track);
        }

        useMeetingStore.getState().setMediaPerm({ video: !mediaPerm.video });
      }
    },
    [client, mediaPerm]
  );

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    useMeetingStore.getState().reset();
    // we close the tracks to perform cleanup
    client.localTracks.forEach((track) => {
      track.close();
    });
    props.onClose();
  };

  return (
    <div className="controller">
      <IconBtn
        icon={mediaPerm.video ? 'mdi:video' : 'mdi:video-off'}
        title={mediaPerm.video ? Translate.closeCamera : Translate.openCamera}
        active={mediaPerm.video}
        disabled={loading}
        size="large"
        onClick={() => mute('video')}
      />

      <IconBtn
        icon={mediaPerm.audio ? 'mdi:microphone' : 'mdi:microphone-off'}
        title={mediaPerm.audio ? Translate.closeMic : Translate.openMic}
        active={mediaPerm.audio}
        disabled={loading}
        size="large"
        onClick={() => mute('audio')}
      />

      <IconBtn
        icon="mdi:phone-remove-outline"
        title={Translate.hangUp}
        danger={true}
        size="large"
        onClick={leaveChannel}
      />
    </div>
  );
});
Controls.displayName = 'Controls';
