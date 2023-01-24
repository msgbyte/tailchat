import { getJWTUserInfo } from '@capital/common';
import type { ILocalVideoTrack } from 'agora-rtc-react';
import { useMemoizedFn } from 'ahooks';
import { useEffect } from 'react';
import { request } from '../request';
import {
  createScreenVideoTrack,
  useClient,
  useScreenSharingClient,
} from './client';
import { useMeetingStore } from './store';

/**
 * 屏幕共享
 */
export function useScreenSharing() {
  const client = useClient();
  const screenSharingClient = useScreenSharingClient();

  useEffect(() => {
    () => {
      screenSharingClient.leave();
    };
  }, []);

  const startScreenSharing = useMemoizedFn(async () => {
    if (!client.channelName) {
      return;
    }

    const track = await createScreenVideoTrack(
      {
        optimizationMode: 'detail',
      },
      'auto'
    );

    let t: ILocalVideoTrack;
    if (Array.isArray(track)) {
      t = track[0];
    } else {
      t = track;
    }
    t.on('track-ended', () => {
      // 画面断开时自动触发停止共享(用户点击停止共享按钮)
      stopScreenSharing();
    });

    const channelName = client.channelName;
    const { _id } = await getJWTUserInfo();
    const uid = _id + '_screen';
    const { data } = await request.post('generateJoinInfo', {
      channelName,
      userId: uid,
    });

    const { appId, token } = data ?? {};
    await screenSharingClient.join(appId, channelName, token, uid);
    await screenSharingClient.publish(track);

    useMeetingStore.getState().setMediaPerm({ screensharing: true });
  });

  const stopScreenSharing = useMemoizedFn(async () => {
    screenSharingClient.localTracks.forEach((t) => t.close());
    await screenSharingClient.unpublish();
    await screenSharingClient.leave();

    useMeetingStore.getState().setMediaPerm({ screensharing: false });
  });

  return {
    startScreenSharing,
    stopScreenSharing,
  };
}
