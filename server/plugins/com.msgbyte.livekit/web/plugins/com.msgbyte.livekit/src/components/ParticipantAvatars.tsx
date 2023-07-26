import React, { useEffect, useRef } from 'react';
import {
  Avatar,
  LoadingSpinner,
  Tooltip,
  UserAvatar,
  UserName,
} from '@capital/component';
import { Translate } from '../translate';
import { useRoomParticipants } from '../utils/useRoomParticipants';

interface Props {
  roomName: string;
}
export const ParticipantAvatars: React.FC<Props> = React.memo((props) => {
  const containerEl = useRef<HTMLDivElement>(null);
  const { participants, fetchParticipants, isFirstLoading } =
    useRoomParticipants(props.roomName);

  useEffect(() => {
    let timer: number;

    const fn = async () => {
      if (containerEl.current && containerEl.current.offsetWidth !== 0) {
        // 该元素可见
        await fetchParticipants();
      }

      timer = window.setTimeout(fn, 3000);
    };

    fn();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  let inner: React.ReactNode;

  if (isFirstLoading) {
    inner = <LoadingSpinner />;
  } else {
    if (participants.length === 0) {
      inner = Translate.nobodyInMeeting;
    } else {
      inner = (
        <>
          <div>{Translate.peopleInMeeting}</div>
          <Avatar.Group
            maxCount={4}
            maxPopoverTrigger="click"
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
          >
            {participants.map((info, i) => (
              <Tooltip
                key={`${info.sid}#${i}`}
                title={<UserName userId={info.identity} />}
                placement="top"
              >
                <UserAvatar userId={info.identity} />
              </Tooltip>
            ))}
          </Avatar.Group>
        </>
      );
    }
  }

  return (
    <div ref={containerEl} style={{ textAlign: 'center' }}>
      {inner}
    </div>
  );
});
ParticipantAvatars.displayName = 'ParticipantAvatars';
