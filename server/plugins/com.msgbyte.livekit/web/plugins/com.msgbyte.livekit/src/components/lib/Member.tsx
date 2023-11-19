import { useParticipants } from '@livekit/components-react';
import * as React from 'react';
import styled from 'styled-components';
import { Icon, UserListItem } from '@capital/component';
import { useEvent } from '@capital/common';
import type { Participant } from 'livekit-client';
import { Translate } from '../../translate';

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: clamp(200px, 55ch, 60ch);
  background-color: var(--lk-bg2);
  border-left: 1px solid var(--lk-border-color);
  padding: 8px;
`;

const IsSpeakingTip = styled.div`
  font-size: 12px;
  opacity: 0.6;
`;

export const Member: React.FC = React.memo(() => {
  const participants = useParticipants();

  const getAction = useEvent((participant: Participant) => {
    return [
      participant.isSpeaking && (
        <IsSpeakingTip>({Translate.isSpeaking})</IsSpeakingTip>
      ),
      <div key="mic-state">
        {participant.isMicrophoneEnabled ? (
          <Icon icon="mdi:microphone" />
        ) : (
          <Icon icon="mdi:microphone-off" />
        )}
      </div>,
    ];
  });

  return (
    <MemberList>
      {participants.map((member) => (
        <UserListItem
          key={member.sid}
          userId={member.identity}
          actions={getAction(member)}
        />
      ))}
    </MemberList>
  );
});
Member.displayName = 'Member';
