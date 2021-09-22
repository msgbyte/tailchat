import { ChatBox } from '@/components/ChatBox';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { UserListItem } from '@/components/UserListItem';
import { Icon } from '@iconify/react';
import { Button } from 'antd';
import React from 'react';
import {
  ChatConverseState,
  t,
  useAppSelector,
  useDMConverseName,
} from 'tailchat-shared';
import { CommonPanelWrapper } from '../common/Wrapper';
import _compact from 'lodash/compact';

const ConversePanelHeader: React.FC<{ converse: ChatConverseState }> =
  React.memo(({ converse }) => {
    const name = useDMConverseName(converse);

    return t('与 {{name}} 的会话', { name });
  });
ConversePanelHeader.displayName = 'ConversePanelHeader';

const ConversePanelMembers: React.FC<{ members: string[] }> = React.memo(
  ({ members }) => {
    return (
      <div>
        {members.map((member) => (
          <UserListItem key={member} userId={member} />
        ))}
      </div>
    );
  }
);
ConversePanelMembers.displayName = 'ConversePanelMembers';

interface ConversePanelProps {
  converseId: string;
}
export const ConversePanel: React.FC<ConversePanelProps> = React.memo(
  ({ converseId }) => {
    const converse = useAppSelector(
      (state) => state.chat.converses[converseId]
    );

    return (
      <CommonPanelWrapper
        header={converse && <ConversePanelHeader converse={converse} />}
        actions={(setRightPanel) => {
          if (!converse) {
            return [];
          }

          return _compact([
            // 当成员数大于2时，显示成员列表按钮
            converse.members.length > 2 && (
              <Button
                key="members"
                icon={
                  <Icon
                    className="anticon text-2xl"
                    icon="mdi:account-supervisor-outline"
                  />
                }
                onClick={() =>
                  setRightPanel({
                    name: t('成员'),
                    panel: <ConversePanelMembers members={converse.members} />,
                  })
                }
              />
            ),
          ]);
        }}
      >
        <ChatBox converseId={converseId} isGroup={false} />
      </CommonPanelWrapper>
    );
  }
);
ConversePanel.displayName = 'ConversePanel';
