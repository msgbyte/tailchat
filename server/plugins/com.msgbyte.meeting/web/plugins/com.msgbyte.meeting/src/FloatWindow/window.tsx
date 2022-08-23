import React, { useState } from 'react';
import { useAsync } from '@capital/common';
import { LoadingSpinner, IconBtn } from '@capital/component';
import { joinMeeting } from '../meeting';
import { useClientState } from '../meeting/useClientState';
import {
  MeetingClientContextProvider,
  useMeetingClientContext,
} from '../meeting/context';
import { PeerView } from './PeerView';
import './window.less';

/**
 * 音视频会议弹窗
 */
export const FloatMeetingWindow: React.FC<{
  onClose: () => void;
}> = React.memo((props) => {
  const [folder, setFolder] = useState(false);
  const { client } = useMeetingClientContext();
  const {
    volume,
    peers,
    webcamSrcObject,
    webcamEnabled,
    micEnabled,
    switchWebcam,
    switchMic,
  } = useClientState(client);

  return (
    <div
      className="plugin-meeting-floatwindow"
      style={{
        transform: folder ? 'translateY(-100%)' : 'none',
      }}
    >
      <div className="body">
        <div>当前正在会议中</div>
        <div>我的音量: {JSON.stringify(volume)}</div>

        <div className="peers">
          {peers.map((peer) => (
            <PeerView key={peer.id} peer={peer} />
          ))}
        </div>
      </div>

      <div className="controller">
        <IconBtn
          icon={webcamEnabled ? 'mdi:video' : 'mdi:video-off'}
          title={webcamEnabled ? '关闭摄像头' : '开启摄像头'}
          size="large"
          onClick={switchWebcam}
        />

        <IconBtn
          icon={micEnabled ? 'mdi:microphone' : 'mdi:microphone-off'}
          title={micEnabled ? '关闭麦克风' : '开启麦克风'}
          size="large"
          onClick={switchMic}
        />

        <IconBtn
          icon="mdi:phone-remove-outline"
          title="挂断"
          danger={true}
          size="large"
          onClick={() => {
            client.close();
            props.onClose();
          }}
        />
      </div>

      <div className="folder-btn" onClick={() => setFolder(!folder)}>
        {folder ? '展开' : '收起'}
      </div>
    </div>
  );
});
FloatMeetingWindow.displayName = 'FloatMeetingWindow';

export const FloatMeetingWindowWrapper: React.FC<{
  meetingId: string;
  onClose: () => void;
}> = React.memo((props) => {
  const { loading, value: client } = useAsync(
    () => joinMeeting(props.meetingId),
    []
  );

  if (loading) {
    return (
      <div className="plugin-meeting-floatwindow">
        <LoadingSpinner />
      </div>
    );
  }

  if (!client) {
    return <div>出现错误</div>;
  }

  return (
    <MeetingClientContextProvider client={client}>
      <FloatMeetingWindow onClose={props.onClose} />;
    </MeetingClientContextProvider>
  );
});
FloatMeetingWindowWrapper.displayName = 'FloatMeetingWindowWrapper';
