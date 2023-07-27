import { useGlobalSocketEvent, useWatch } from '@capital/common';
import { Avatar, Tooltip, UserAvatar, UserName } from '@capital/component';
import React, { useEffect, useState } from 'react';
import { useRoomParticipants } from '../utils/useRoomParticipants';

export const LivekitPanelBadge: React.FC<{
  groupId: string;
  panelId: string;
}> = React.memo((props) => {
  const roomName = `${props.groupId}#${props.panelId}`;
  const { participants, fetchParticipants } = useRoomParticipants(roomName);
  const [displayParticipants, setDisplayParticipants] = useState<
    {
      sid: string;
      identity: string;
    }[]
  >([]);

  useWatch([participants.length], () => {
    setDisplayParticipants(participants);
  });

  useEffect(() => {
    fetchParticipants();
  }, []);

  useGlobalSocketEvent(
    'plugin:com.msgbyte.livekit.participantJoined',
    (payload: any) => {
      if (
        payload.groupId === props.groupId &&
        payload.panelId === props.panelId &&
        payload.participant
      ) {
        setDisplayParticipants((state) => [...state, payload.participant]);
      }
    }
  );

  useGlobalSocketEvent(
    'plugin:com.msgbyte.livekit.participantLeft',
    (payload: any) => {
      if (
        payload.groupId === props.groupId &&
        payload.panelId === props.panelId &&
        payload.participant
      ) {
        setDisplayParticipants((state) => {
          const index = state.findIndex(
            (item) => item.sid === payload.participant.sid
          );
          if (index >= 0) {
            const fin = [...state];
            fin.splice(index, 1);
            return fin;
          } else {
            return [...state];
          }
        });
      }
    }
  );

  return (
    <Avatar.Group
      maxCount={4}
      maxPopoverTrigger="click"
      style={{ verticalAlign: 'middle' }}
      maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
    >
      {displayParticipants.map((info, i) => (
        <Tooltip
          key={`${info.sid}#${i}`}
          title={<UserName userId={info.identity} />}
          placement="top"
        >
          <UserAvatar userId={info.identity} size={24} />
        </Tooltip>
      ))}
    </Avatar.Group>
  );
});
LivekitPanelBadge.displayName = 'LivekitPanelBadge';

export default LivekitPanelBadge;
