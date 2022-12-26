import { IconBtn } from '@capital/component';
import React, { useState } from 'react';
import { useClient, useMicrophoneAndCameraTracks } from './client';

export const Controls: React.FC<{
  onClose: () => void;
}> = React.memo((props) => {
  const client = useClient();
  const [trackState, setTrackState] = useState({ video: false, audio: false });
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const mute = async (type: 'audio' | 'video') => {
    if (type === 'audio') {
      if (trackState.audio === true) {
        // await tracks[0].setEnabled(false);
        await client.unpublish(tracks[0]);
      } else {
        // await tracks[0].setEnabled(true);
        await client.publish(tracks[0]);
      }
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === 'video') {
      if (trackState.video === true) {
        // await tracks[1].setEnabled(false);
        await client.unpublish(tracks[1]);
      } else {
        // await tracks[1].setEnabled(true);
        await client.publish(tracks[1]);
      }
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    // we close the tracks to perform cleanup
    tracks[0].close();
    tracks[1].close();
    props.onClose();
  };

  return (
    <div className="controller">
      <IconBtn
        icon={trackState.video ? 'mdi:video' : 'mdi:video-off'}
        title={trackState.video ? '关闭摄像头' : '开启摄像头'}
        disabled={!ready}
        size="large"
        onClick={() => mute('video')}
      />

      <IconBtn
        icon={trackState.audio ? 'mdi:microphone' : 'mdi:microphone-off'}
        title={trackState.audio ? '关闭麦克风' : '开启麦克风'}
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
