import { ChatBox } from '@/components/ChatBox';
import { ChatInputMentionsContextProvider } from '@/components/ChatBox/ChatInputBox/context';
import { IconBtn } from '@/components/IconBtn';
import {
  GroupPluginPanelActionProps,
  pluginPanelActions,
} from '@/plugin/common';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  useGroupPanelInfo,
  useGroupMemberInfos,
  useGroupMemberMute,
  useUserId,
  t,
  humanizeMsDuration,
  useInterval,
  PERMISSION,
  useGroupInfo,
  GroupPanelType,
  useHasGroupPanelPermission,
} from 'tailchat-shared';
import { useFriendNicknameMap } from 'tailchat-shared/redux/hooks/useFriendNickname';
import { MembersPanel } from './MembersPanel';
import { GroupPanelContainer } from './shared/GroupPanelContainer';

/**
 * 聊天输入框显示状态管理
 */
function useChatInputInfo(groupId: string, panelId: string) {
  const userId = useUserId();
  const muteUntil = useGroupMemberMute(groupId, userId ?? '');
  const [hasPermission] = useHasGroupPanelPermission(groupId, panelId, [
    PERMISSION.core.message,
  ]);

  const [placeholder, setPlaceholder] = useState<string | undefined>(undefined);
  const updatePlaceholder = useCallback(() => {
    if (muteUntil) {
      setPlaceholder(
        muteUntil
          ? (t('禁言中, 还剩 {{remain}}', {
              remain: humanizeMsDuration(
                new Date().valueOf() - new Date(muteUntil).valueOf()
              ),
            }) as string)
          : undefined
      );
    } else {
      setPlaceholder(undefined);
    }
  }, [muteUntil]);
  useInterval(
    updatePlaceholder,
    10000 // 10s 检查一次，因为 humanizeMsDuration 不会精确到秒
  );
  useLayoutEffect(() => {
    // 当到期时间发生变化后立即更新
    updatePlaceholder();
  }, [muteUntil]);

  if (!hasPermission) {
    return {
      disabled: true,
      placeholder: t('没有发送消息的权限, 请联系群组所有者'),
    };
  }

  return {
    disabled: Boolean(muteUntil),
    placeholder,
  };
}

interface TextPanelProps {
  groupId: string;
  panelId: string;
}
export const TextPanel: React.FC<TextPanelProps> = React.memo(
  ({ groupId, panelId }) => {
    const group = useGroupInfo(groupId);
    const groupMembers = useGroupMemberInfos(groupId);
    const panelInfo = useGroupPanelInfo(groupId, panelId);
    const { disabled, placeholder } = useChatInputInfo(groupId, panelId);
    const friendNicknameMap = useFriendNicknameMap();

    if (!group) {
      return null;
    }

    if (!panelInfo) {
      return null;
    }

    return (
      <GroupPanelContainer
        groupId={groupId}
        panelId={panelId}
        prefixActions={() => [
          ...pluginPanelActions
            .filter(
              (action): action is GroupPluginPanelActionProps =>
                action.position === 'group'
            )
            .map((action) => (
              <IconBtn
                key={action.name}
                title={action.label}
                shape="square"
                icon={action.icon}
                iconClassName="text-2xl"
                onClick={() =>
                  action.onClick({
                    groupId,
                    panelId,
                  })
                }
              />
            )),
        ]}
        suffixActions={({ setRightPanel }) => [
          <IconBtn
            key="members"
            title={t('成员列表')}
            shape="square"
            icon="mdi:account-supervisor-outline"
            iconClassName="text-2xl"
            onClick={() =>
              setRightPanel({
                name: t('成员') + ` (${groupMembers.length})`,
                panel: <MembersPanel groupId={groupId} />,
              })
            }
          />,
        ]}
      >
        <ChatInputMentionsContextProvider
          users={groupMembers.map((m) => ({
            id: m._id,
            display: friendNicknameMap[m._id]
              ? friendNicknameMap[m._id]
              : m.nickname,
          }))}
          panels={group.panels
            .filter((p) => p.type !== GroupPanelType.GROUP)
            .map((p) => ({
              id: `/main/group/${groupId}/${p.id}`,
              display: p.name,
            }))}
          disabled={disabled}
          placeholder={placeholder}
        >
          <ChatBox
            converseId={panelId}
            converseTitle={panelInfo.name}
            isGroup={true}
            groupId={groupId}
          />
        </ChatInputMentionsContextProvider>
      </GroupPanelContainer>
    );
  }
);
TextPanel.displayName = 'TextPanel';
