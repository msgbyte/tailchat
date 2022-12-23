import { IconBtn } from '@capital/component';
import type { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';
import React, { useState } from 'react';
import { useClient } from './client';

export const Controls: React.FC<{
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}> = React.memo((props) => {
  const client = useClient();
  const { tracks, setStart } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const mute = async (type: 'audio' | 'video') => {
    if (type === 'audio') {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === 'video') {
      await tracks[1].setEnabled(!trackState.video);
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
    setStart(false);
    props.onClose();
  };

  return (
    <div className="controller">
      <IconBtn
        icon={trackState.audio ? 'mdi:video' : 'mdi:video-off'}
        title={trackState.audio ? '关闭摄像头' : '开启摄像头'}
        size="large"
        onClick={() => mute('video')}
      />

      <IconBtn
        icon={trackState.video ? 'mdi:microphone' : 'mdi:microphone-off'}
        title={trackState.video ? '关闭麦克风' : '开启麦克风'}
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
