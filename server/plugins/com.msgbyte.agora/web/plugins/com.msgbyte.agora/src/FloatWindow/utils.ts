import type {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalTrack,
  ILocalVideoTrack,
} from 'agora-rtc-react';

/**
 * 获取客户端本地轨道
 */
export function getClientLocalTrack(
  client: IAgoraRTCClient,
  trackMediaType: 'video'
): ILocalVideoTrack | null;
export function getClientLocalTrack(
  client: IAgoraRTCClient,
  trackMediaType: 'audio'
): ILocalAudioTrack | null;
export function getClientLocalTrack(
  client: IAgoraRTCClient,
  trackMediaType: string
): ILocalTrack | null {
  return (
    client.localTracks.find(
      (track) => track.trackMediaType === trackMediaType
    ) ?? null
  );
}
