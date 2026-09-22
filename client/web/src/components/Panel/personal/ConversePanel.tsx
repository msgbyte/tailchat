import { ChatBox } from '@/components/ChatBox';
import { UserListItem } from '@/components/UserListItem';
import React from 'react';
import {
  ChatConverseState,
  model,
  showAlert,
  t,
  useAppSelector,
  useDMConverseName,
  useUserId,
  useUserInfoList,
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
import { MessageSearchPanel } from '../common/MessageSearch';
import { ChatInputMentionsContextProvider } from '@/components/ChatBox/ChatInputBox/context';
import { Navigate } from 'react-router';
import { refreshDMConverse } from 'tailchat-shared/helper/converse-helper';

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
    const removed = useAppSelector(
      (state) => state.chat.converseMembership[converseId]?.removed
    );
    const userId = useUserId();
    const userInfos = useUserInfoList(
      (converse?.members ?? []).filter((m) => m !== userId)
    );

    const { hasOpenedPanel, openPanelWindow, closePanelWindow } =
      usePanelWindow(`/panel/personal/converse/${converseId}`);
    if (removed) {
      return <Navigate to="/main/personal/friends" replace />;
    }
    if (hasOpenedPanel) {
      return <OpenedPanelTip onClosePanelWindow={closePanelWindow} />;
    }

    const converseHeader = converse && (
      <ConversePanelTitle converse={converse} />
    );

    return (
      <CommonPanelWrapper
        header={converseHeader}
        actions={({ setRightPanel }) => {
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
            converse.type === model.converse.ChatConverseType.DM ? (
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
            <IconBtn
              key="search"
              title={t('聊天记录搜索')}
              shape="square"
              icon="mdi:text-search"
              iconClassName="text-2xl"
              onClick={() =>
                setRightPanel({
                  name: t('聊天记录'),
                  panel: <MessageSearchPanel converseId={converseId} />,
                })
              }
            />,
            converse.type === model.converse.ChatConverseType.Multi && (
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
            converse.type === model.converse.ChatConverseType.Multi && (
              <IconBtn
                key="leave"
                title={t('退出会话')}
                shape="square"
                icon="mdi:logout"
                iconClassName="text-2xl"
                danger={true}
                onClick={() =>
                  showAlert({
                    message: t(
                      '确定要退出此多人会话么？退出后将不再接收此会话的消息'
                    ),
                    onConfirm: async () => {
                      await model.converse.leaveDMConverse(converseId);
                      if (userId) {
                        await refreshDMConverse(converseId, userId);
                      }
                    },
                  })
                }
              />
            ),
          ]);
        }}
      >
        <ChatInputMentionsContextProvider
          users={userInfos.map((m) => ({
            id: m._id,
            display: m.nickname,
          }))}
        >
          <ChatBox
            converseId={converseId}
            converseTitle={converseHeader}
            isGroup={false}
          />
        </ChatInputMentionsContextProvider>
      </CommonPanelWrapper>
    );
  }
);
ConversePanel.displayName = 'ConversePanel';
