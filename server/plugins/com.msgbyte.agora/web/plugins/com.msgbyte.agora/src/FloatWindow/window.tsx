import React, { useEffect, useState } from 'react';
import { getJWTUserInfo } from '@capital/common';
import type { IAgoraRTCRemoteUser } from 'agora-rtc-react';
import styled from 'styled-components';
import {
  appId,
  token,
  useClient,
  useMicrophoneAndCameraTracks,
} from './client';
import { Videos } from './Videos';
import { Controls } from './Controls';

const FloatWindow = styled.div`
  z-index: 100;
  position: fixed;
  background-color: var(--tc-content-background-color);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  left: 0;
  right: 0;
  top: 0;
  min-height: 240px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;

    .videos {
      height: 70vh;
      align-self: flex-start;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
      justify-items: center;
      align-items: center;

      .vid {
        height: 95%;
        width: 95%;
        position: relative;
        background-color: black;
        border-width: 1px;
        border-color: #38373a;
        border-style: solid;
      }
    }
  }

  .controller {
    text-align: center;
    padding: 10px 0;

    * + * {
      margin-left: 10px;
    }
  }

  .folder-btn {
    background-color: var(--tc-content-background-color);
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    position: absolute;
    bottom: -30px;
    height: 30px;
    line-height: 30px;
    left: 50%;
    width: 60px;
    margin-left: -30px;
    text-align: center;
    cursor: pointer;
    border-radius: 0 0 3px 3px;
  }
`;

/**
 * 音视频会议弹窗
 */
export const FloatMeetingWindow: React.FC<{
  meetingId: string;
  onClose: () => void;
}> = React.memo((props) => {
  const [folder, setFolder] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  const channelName = props.meetingId;
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);

  useEffect(() => {
    // function to initialise the SDK
    const init = async (channel: string) => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log('subscribe success');
        if (mediaType === 'video') {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, type) => {
        console.log('unpublished', user, type);
        if (type === 'audio') {
          user.audioTrack?.stop();
        }
        if (type === 'video') {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on('user-left', (user) => {
        console.log('leaving', user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      const { _id } = await getJWTUserInfo();
      await client.join(appId, channel, token, _id);
      if (tracks) {
        await client.publish([tracks[0], tracks[1]]);
      }
      setStart(true);
    };

    if (ready && tracks) {
      console.log('init ready');
      init(channelName);
    }
  }, [channelName, client, ready, tracks]);

  return (
    <FloatWindow
      style={{
        transform: folder ? 'translateY(-100%)' : 'none',
      }}
    >
      <div className="body">
        {start && tracks && <Videos users={users} tracks={tracks} />}
      </div>

      <div className="controller">
        {ready && tracks && (
          <Controls
            tracks={tracks}
            setStart={setStart}
            onClose={props.onClose}
          />
        )}
      </div>

      <div className="folder-btn" onClick={() => setFolder(!folder)}>
        {folder ? '展开' : '收起'}
      </div>
    </FloatWindow>
  );
});
FloatMeetingWindow.displayName = 'FloatMeetingWindow';
