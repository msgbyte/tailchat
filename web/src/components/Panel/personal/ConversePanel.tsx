import { ChatBox } from '@/components/ChatBox';
import React from 'react';
import { joinArray, Trans, useAppSelector, useUserId } from 'tailchat-shared';
import { PanelCommonHeader } from '../common/Header';
import _without from 'lodash/without';
import _take from 'lodash/take';
import { UserName } from '@/components/UserName';

function useConverseTitle(converseId: string): React.ReactNode {
  const members = useAppSelector(
    (state) => state.chat.converses[converseId]?.members ?? []
  );
  const userId = useUserId();
  const otherMembers = _without<string>(members, userId ?? '');
  const len = otherMembers.length;

  if (len === 1) {
    return (
      <Trans>
        与 <UserName userId={otherMembers[0]} /> 的会话
      </Trans>
    );
  } else if (len === 2) {
    return (
      <Trans>
        与 <UserName userId={otherMembers[0]} /> 和{' '}
        <UserName userId={otherMembers[1]} /> 的多人会话
      </Trans>
    );
  } else {
    const membersEl = joinArray(
      _take(otherMembers, 2).map((uid) => <UserName key={uid} userId={uid} />),
      <span>，</span>
    );
    return (
      <Trans>
        与 <span>{{ membersEl }}</span> 等人的多人会话
      </Trans>
    );
  }
}

interface ConversePanelProps {
  converseId: string;
}
export const ConversePanel: React.FC<ConversePanelProps> = React.memo(
  ({ converseId }) => {
    const title = useConverseTitle(converseId);

    return (
      <div className="flex flex-col overflow-hidden flex-1">
        <PanelCommonHeader actions={[]}>{title}</PanelCommonHeader>
        <div className="flex-1 overflow-hidden">
          <ChatBox converseId={converseId} isGroup={false} />
        </div>
      </div>
    );
  }
);
ConversePanel.displayName = 'ConversePanel';
