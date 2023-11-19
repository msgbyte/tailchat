import React from 'react';
import styled from 'styled-components';
import { Translate } from '../translate';
import { IconBtn, UserNamePure } from '@capital/component';

const Root = styled.div`
  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 20px;
  }
`;

interface InviteCallNotificationProps {
  senderUserId: string;
  roomName: string;
  onJoin?: () => void;
}
const InviteCallNotification: React.FC<InviteCallNotificationProps> =
  React.memo((props) => {
    return (
      <Root>
        <audio src="/audio/telephone.mp3" loop={true} autoPlay={true} />
        <div>
          <b>
            <UserNamePure userId={props.senderUserId} />
          </b>{' '}
          {Translate.inviteJoinCall}
        </div>
        <div className="actions">
          <IconBtn icon="mdi:phone-in-talk" onClick={props.onJoin} />
        </div>
      </Root>
    );
  });
InviteCallNotification.displayName = 'InviteCallNotification';

export default InviteCallNotification;
