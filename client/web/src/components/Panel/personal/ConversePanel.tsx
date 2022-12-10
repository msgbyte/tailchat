import { ChatBox } from '@/components/ChatBox';
import { UserListItem } from '@/components/UserListItem';
import React from 'react';
import {
  ChatConverseState,
  t,
  useAppSelector,
  useDMConverseName,
} from 'tailchat-shared';
import { CommonPanelWrapper } from '../common/Wrapper';
import _compact from 'lodash/compact';
import { openModal } from '@/components/Modal';
import { AppendDMConverseMembers } from '@/components/modals/AppendDMConverseMembers';
import { usePanelWindow } from '@/hooks/usePanelWindow';
import { OpenedPanelTip } from '@/components/OpenedPanelTip';
import { IconBtn } from '@/components/IconBtn';
import { DMPluginPanelActionProps, pluginPanelActions } from '@/plugin/common';
import { CreateDMConverse } from '@/components/modals/CreateDMConverse';

const ConversePanelTitle: React.FC<{ converse: ChatConverseState }> =
  React.memo(({ converse }) => {
    const name = useDMConverseName(converse);

    return t('与 {{name}} 的会话', { name });
  });
ConversePanelTitle.displayName = 'ConversePanelTitle';

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

    const { hasOpenedPanel, openPanelWindow, closePanelWindow } =
      usePanelWindow(`/panel/personal/converse/${converseId}`);
    if (hasOpenedPanel) {
      return <OpenedPanelTip onClosePanelWindow={closePanelWindow} />;
    }

    const converseHeader = converse && (
      <ConversePanelTitle converse={converse} />
    );

    return (
      <CommonPanelWrapper
        header={converseHeader}
        actions={(setRightPanel) => {
          if (!converse) {
            return [];
          }

          return _compact([
            ...pluginPanelActions
              .filter(
                (action): action is DMPluginPanelActionProps =>
                  action.position === 'dm'
              )
              .map((action) => (
                <IconBtn
                  key={action.name}
                  title={action.label}
                  shape="square"
                  icon={action.icon}
                  iconClassName="text-2xl"
                  onClick={() => action.onClick({ converseId })}
                />
              )),
            <IconBtn
              key="open"
              title={t('在新窗口打开')}
              shape="square"
              icon="mdi:dock-window"
              iconClassName="text-2xl"
              onClick={openPanelWindow}
            />,
            converse.members.length === 2 ? (
              <IconBtn
                key="create"
                title={t('创建会话')}
                shape="square"
                icon="mdi:account-multiple-plus-outline"
                iconClassName="text-2xl"
                onClick={() =>
                  openModal(
                    <CreateDMConverse hiddenUserIds={converse.members} />
                  )
                }
              />
            ) : (
              <IconBtn
                key="add"
                title={t('邀请成员')}
                shape="square"
                icon="mdi:account-multiple-plus-outline"
                iconClassName="text-2xl"
                onClick={() =>
                  openModal(
                    <AppendDMConverseMembers
                      converseId={converse._id}
                      withoutUserIds={converse.members}
                    />
                  )
                }
              />
            ),
            // 当成员数大于2时，显示成员列表按钮
            converse.members.length > 2 && (
              <IconBtn
                key="members"
                title={t('成员列表')}
                shape="square"
                icon="mdi:account-supervisor-outline"
                iconClassName="text-2xl"
                onClick={() =>
                  setRightPanel({
                    name: t('成员') + ` (${converse.members.length})`,
                    panel: <ConversePanelMembers members={converse.members} />,
                  })
                }
              />
            ),
          ]);
        }}
      >
        <ChatBox
          converseId={converseId}
          converseTitle={converseHeader}
          isGroup={false}
        />
      </CommonPanelWrapper>
    );
  }
);
ConversePanel.displayName = 'ConversePanel';
