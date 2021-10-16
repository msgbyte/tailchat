import { ChatBox } from '@/components/ChatBox';
import { UserListItem } from '@/components/UserListItem';
import { Icon } from '@iconify/react';
import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
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
import { openInNewWindow, panelWindowManager } from '@/utils/window-helper';
import { usePanelWindow } from '@/hooks/usePanelWindow';

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
      return (
        <div>
          <div>{t('面板已在独立窗口打开')}</div>
          <Button onClick={closePanelWindow}>{t('关闭独立窗口')}</Button>
        </div>
      );
    }

    return (
      <CommonPanelWrapper
        header={converse && <ConversePanelTitle converse={converse} />}
        actions={(setRightPanel) => {
          if (!converse) {
            return [];
          }

          return _compact([
            <Tooltip key="open" title={t('在新窗口打开')}>
              <Button
                icon={
                  <Icon className="anticon text-2xl" icon="mdi:dock-window" />
                }
                onClick={openPanelWindow}
              />
            </Tooltip>,
            <Tooltip key="add" title={t('邀请成员')}>
              <Button
                icon={
                  <Icon
                    className="anticon text-2xl"
                    icon="mdi:account-multiple-plus-outline"
                  />
                }
                onClick={() =>
                  openModal(
                    <AppendDMConverseMembers
                      converseId={converse._id}
                      withoutUserIds={converse.members}
                    />
                  )
                }
              />
            </Tooltip>,
            // 当成员数大于2时，显示成员列表按钮
            converse.members.length > 2 && (
              <Tooltip key="members" title={t('成员列表')}>
                <Button
                  icon={
                    <Icon
                      className="anticon text-2xl"
                      icon="mdi:account-supervisor-outline"
                    />
                  }
                  onClick={() =>
                    setRightPanel({
                      name: t('成员'),
                      panel: (
                        <ConversePanelMembers members={converse.members} />
                      ),
                    })
                  }
                />
              </Tooltip>
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
