import {
  AgoraVideoPlayer,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-react';
import React from 'react';

export const Videos: React.FC<{
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}> = React.memo((props) => {
  const { users, tracks } = props;

  return (
    <div>
      <div className="videos">
        {/* AgoraVideoPlayer component takes in the video track to render the stream,
            you can pass in other props that get passed to the rendered div */}
        <AgoraVideoPlayer className="vid" videoTrack={tracks[1]} />

        {users.length > 0 &&
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <AgoraVideoPlayer
                  className="vid"
                  videoTrack={user.videoTrack}
                  key={user.uid}
                />
              );
            } else {
              return null;
            }
          })}
      </div>
    </div>
  );
});
Videos.displayName = 'Videos';
