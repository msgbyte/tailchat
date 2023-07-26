import { Avatar, Tooltip, UserAvatar, UserName } from '@capital/component';
import React, { useEffect } from 'react';
import { useRoomParticipants } from '../utils/useRoomParticipants';

export const LivekitPanelBadge: React.FC<{
  groupId: string;
  panelId: string;
}> = React.memo((props) => {
  const roomName = `${props.groupId}#${props.panelId}`;
  const { participants, fetchParticipants } = useRoomParticipants(roomName);

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <Avatar.Group
      maxCount={4}
      maxPopoverTrigger="click"
      style={{ verticalAlign: 'middle' }}
      maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
    >
      {participants.map((info, i) => (
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
