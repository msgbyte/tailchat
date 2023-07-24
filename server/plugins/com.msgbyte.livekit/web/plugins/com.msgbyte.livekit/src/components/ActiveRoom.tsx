import { LoadingSpinner } from '@capital/component';
import {
  formatChatMessageLinks,
  LiveKitRoom,
  LocalUserChoices,
} from '@livekit/components-react';
import { RoomOptions, VideoPresets } from 'livekit-client';
import React, { useMemo } from 'react';
import { useServerUrl } from '../utils/useServerUrl';
import { useToken } from '../utils/useToken';
import { VideoConference } from './lib/VideoConference';

type ActiveRoomProps = {
  userChoices: LocalUserChoices;
  roomName: string;
  region?: string;
  onLeave?: () => void;
  hq?: boolean;
};
export const ActiveRoom: React.FC<ActiveRoomProps> = React.memo((props) => {
  const { roomName, userChoices, onLeave, hq } = props;

  const token = useToken(roomName);
  const liveKitUrl = useServerUrl();

  const roomOptions = useMemo((): RoomOptions => {
    return {
      videoCaptureDefaults: {
        deviceId: userChoices.videoDeviceId ?? undefined,
        resolution: hq === true ? VideoPresets.h2160 : VideoPresets.h720,
      },
      publishDefaults: {
        videoSimulcastLayers:
          hq === true
            ? [VideoPresets.h1080, VideoPresets.h720]
            : [VideoPresets.h540, VideoPresets.h216],
      },
      audioCaptureDefaults: {
        deviceId: userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
    };
  }, [userChoices, hq]);

  return (
    <>
      {token && liveKitUrl ? (
        <LiveKitRoom
          token={token}
          serverUrl={liveKitUrl}
          options={roomOptions}
          video={userChoices.videoEnabled}
          audio={userChoices.audioEnabled}
          onDisconnected={onLeave}
        >
          <VideoConference chatMessageFormatter={formatChatMessageLinks} />
        </LiveKitRoom>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
});
ActiveRoom.displayName = 'ActiveRoom';
