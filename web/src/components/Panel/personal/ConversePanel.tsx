import { ChatBox } from '@/components/ChatBox';
import React from 'react';
import {
  ChatConverseState,
  t,
  useAppSelector,
  useDMConverseName,
} from 'tailchat-shared';
import { PanelCommonHeader } from '../common/Header';
import _isNil from 'lodash/isNil';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const ConversePanelHeader: React.FC<{ converse: ChatConverseState }> =
  React.memo(({ converse }) => {
    const name = useDMConverseName(converse);

    return (
      <PanelCommonHeader actions={[]}>
        {t('与 {{name}} 的会话', { name })}
      </PanelCommonHeader>
    );
  });
ConversePanelHeader.displayName = 'ConversePanelHeader';

interface ConversePanelProps {
  converseId: string;
}
export const ConversePanel: React.FC<ConversePanelProps> = React.memo(
  ({ converseId }) => {
    const converse = useAppSelector(
      (state) => state.chat.converses[converseId]
    );

    if (_isNil(converse)) {
      return <LoadingSpinner />;
    }

    return (
      <div className="flex flex-col overflow-hidden flex-1">
        <ConversePanelHeader converse={converse} />
        <div className="flex-1 overflow-hidden">
          <ChatBox converseId={converseId} isGroup={false} />
        </div>
      </div>
    );
  }
);
ConversePanel.displayName = 'ConversePanel';
