import type { IAgoraRTCClient, ILocalTrack } from 'agora-rtc-react';

/**
 * 获取客户端本地轨道
 */
export function getClientLocalTrack(
  client: IAgoraRTCClient,
  trackMediaType: 'audio' | 'video'
): ILocalTrack | null {
  return (
    client.localTracks.find(
      (track) => track.trackMediaType === trackMediaType
    ) ?? null
  );
}
