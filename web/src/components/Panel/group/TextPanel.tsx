import { ChatBox } from '@/components/ChatBox';
import { ChatInputMentionsContextProvider } from '@/components/ChatBox/ChatInputBox/context';
import React, { useState } from 'react';
import {
  useGroupPanelInfo,
  useGroupMemberInfos,
  useGroupMemberMute,
  useUserId,
  t,
  humanizeMsDuration,
  useInterval,
} from 'tailchat-shared';
import { GroupPanelWrapper } from './Wrapper';

interface TextPanelProps {
  groupId: string;
  panelId: string;
}
export const TextPanel: React.FC<TextPanelProps> = React.memo(
  ({ groupId, panelId }) => {
    const groupMembers = useGroupMemberInfos(groupId);
    const panelInfo = useGroupPanelInfo(groupId, panelId);
    const userId = useUserId();
    const muteUntil = useGroupMemberMute(groupId, userId ?? '');

    const [placeholder, setPlaceholder] = useState<string | undefined>(
      undefined
    );
    useInterval(() => {
      if (muteUntil) {
        setPlaceholder(
          muteUntil
            ? t('禁言中, 还剩 {{remain}}', {
                remain: humanizeMsDuration(
                  new Date().valueOf() - new Date(muteUntil).valueOf()
                ),
              })
            : undefined
        );
      } else {
        setPlaceholder(undefined);
      }
      // 10s 检查一次，因为 humanizeMsDuration 不会精确到秒
    }, 10000);

    if (panelInfo === undefined) {
      return null;
    }

    return (
      <GroupPanelWrapper groupId={groupId} panelId={panelId} showHeader={true}>
        <ChatInputMentionsContextProvider
          users={groupMembers.map((m) => ({
            id: m._id,
            display: m.nickname,
          }))}
          disabled={Boolean(muteUntil)}
          placeholder={placeholder}
        >
          <ChatBox converseId={panelId} isGroup={true} groupId={groupId} />
        </ChatInputMentionsContextProvider>
      </GroupPanelWrapper>
    );
  }
);
TextPanel.displayName = 'TextPanel';
