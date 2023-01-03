import React, { useEffect, useRef, useState } from 'react';
import { getJWTUserInfo, isValidStr, showErrorToasts } from '@capital/common';
import { useClient } from './client';
import { Videos } from './Videos';
import { Controls } from './Controls';
import { LoadingSpinner } from '@capital/component';
import { useMemoizedFn } from 'ahooks';
import { request } from '../request';
import styled from 'styled-components';
import { useMeetingStore } from './store';
import { NetworkStats } from './NetworkStats';
import _once from 'lodash/once';
import type { IAgoraRTCClient } from 'agora-rtc-react';

const Root = styled.div`
  .body {
    flex: 1;
  }

  .controller {
    text-align: center;
    padding: 10px 0;

    * + * {
      margin-left: 10px;
    }
  }
`;

const enableDualStream = _once((client: IAgoraRTCClient) => {
  return client.enableDualStream();
});

export interface MeetingViewProps {
  meetingId: string;
  onClose: () => void;
}
export const MeetingView: React.FC<MeetingViewProps> = React.memo((props) => {
  const client = useClient();
  const channelName = props.meetingId;
  const [start, setStart] = useState<boolean>(false);
  const initedRef = useRef(false);

  const init = useMemoizedFn(async (channelName: string) => {
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      console.log('subscribe success');
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }

      useMeetingStore.getState().updateUserInfo(user);
    });

    client.on('user-unpublished', async (user, mediaType) => {
      console.log('unpublished', user, mediaType);
      await client.unsubscribe(user, mediaType);
      if (mediaType === 'audio') {
        user.audioTrack?.stop();
      }
      useMeetingStore.getState().updateUserInfo(user);
    });

    client.on('user-joined', (user) => {
      console.log('user-joined', user);
      useMeetingStore.getState().appendUser(user);
    });

    client.on('user-left', (user) => {
      console.log('user-left', user);
      useMeetingStore.getState().removeUser(user);
    });

    client.on('volume-indicator', (volumes) => {
      useMeetingStore.setState({
        volumes: volumes.map((v) => ({
          uid: String(v.uid),
          level: v.level,
        })),
      });
    });

    try {
      const { _id } = await getJWTUserInfo();
      const { data } = await request.post('generateJoinInfo', {
        channelName,
      });

      const { appId, token } = data ?? {};

      await client.join(appId, channelName, token, _id);
      await enableDualStream(client);
      client.enableAudioVolumeIndicator();
      setStart(true);
    } catch (err) {
      showErrorToasts(err);
    }
  });

  useEffect(() => {
    if (initedRef.current) {
      return;
    }

    if (isValidStr(channelName)) {
      init(channelName);
      initedRef.current = true;
    }
  }, [channelName]);

  return (
    <Root>
      <NetworkStats />

      <div className="body">
        {start ? <Videos /> : <LoadingSpinner tip={'正在加入通话...'} />}
      </div>

      <div className="controller">
        <Controls onClose={props.onClose} />
      </div>
    </Root>
  );
});
MeetingView.displayName = 'MeetingView';
