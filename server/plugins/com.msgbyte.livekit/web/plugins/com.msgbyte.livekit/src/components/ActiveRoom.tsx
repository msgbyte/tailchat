import { LoadingSpinner } from '@capital/component';
import {
  formatChatMessageLinks,
  LiveKitRoom,
  LocalUserChoices,
  useRoomContext,
} from '@livekit/components-react';
import { RoomOptions, ScreenSharePresets, VideoPresets } from 'livekit-client';
import React, { useEffect, useMemo } from 'react';
import { useLivekitState } from '../store/useLivekitState';
import { useServerUrl } from '../utils/useServerUrl';
import { useToken } from '../utils/useToken';
import { VideoConference } from './lib/VideoConference';
import { MeetingContextProvider } from '../context/MeetingContext';

const UpdateRoom: React.FC = React.memo(() => {
  const room = useRoomContext();

  useEffect(() => {
    useLivekitState.setState({ activeRoom: room });
  }, [room]);

  return null;
});
UpdateRoom.displayName = 'UpdateRoom';

type ActiveRoomProps = {
  userChoices: LocalUserChoices;
  roomName: string;
  autoInviteIds?: string[];
  region?: string;
  onLeave?: () => void;
  hq?: boolean;
};
export const ActiveRoom: React.FC<ActiveRoomProps> = React.memo((props) => {
  const { roomName, userChoices, autoInviteIds, onLeave, hq } = props;

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
            : [VideoPresets.h720, VideoPresets.h540, VideoPresets.h216],
        screenShareSimulcastLayers:
          hq === true
            ? [ScreenSharePresets.h1080fps15, ScreenSharePresets.h720fps5]
            : [ScreenSharePresets.h720fps5, ScreenSharePresets.h360fps3],
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
          <MeetingContextProvider meetingId={roomName}>
            <VideoConference
              autoInviteIds={autoInviteIds}
              chatMessageFormatter={formatChatMessageLinks}
            />
          </MeetingContextProvider>

          <UpdateRoom />
        </LiveKitRoom>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
});
ActiveRoom.displayName = 'ActiveRoom';
