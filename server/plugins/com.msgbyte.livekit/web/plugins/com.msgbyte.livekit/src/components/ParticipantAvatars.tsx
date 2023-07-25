import React, { useEffect, useRef } from 'react';
import { Avatar, Tooltip, UserAvatar, UserName } from '@capital/component';
import { useAsyncFn, useEvent } from '@capital/common';
import { request } from '../request';
import { Translate } from '../translate';

interface Props {
  roomName: string;
}
export const ParticipantAvatars: React.FC<Props> = React.memo((props) => {
  const containerEl = useRef<HTMLDivElement>(null);
  const [{ value: participants = [] }, _handleFetchParticipants] =
    useAsyncFn(async () => {
      const { data } = await request.post('roomMembers', {
        roomName: props.roomName,
      });

      return data ?? [];
    }, [props.roomName]);

  const handleFetchParticipants = useEvent(_handleFetchParticipants);

  useEffect(() => {
    let timer: number;

    const fn = async () => {
      if (containerEl.current && containerEl.current.offsetWidth !== 0) {
        // 该元素可见
        await handleFetchParticipants();
      }

      timer = window.setTimeout(fn, 3000);
    };

    timer = window.setTimeout(fn, 3000);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  let inner: React.ReactNode;

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
          {[
            ...participants,
            ...participants,
            ...participants,
            ...participants,
            ...participants,
            ...participants,
          ].map((info, i) => (
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

  return (
    <div ref={containerEl} style={{ textAlign: 'center' }}>
      {inner}
    </div>
  );
});
ParticipantAvatars.displayName = 'ParticipantAvatars';
