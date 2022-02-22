import { ChatBox } from '@/components/ChatBox';
import { ChatInputMentionsContextProvider } from '@/components/ChatBox/ChatInputBox/context';
import React from 'react';
import { useGroupPanel, useGroupMemberInfos } from 'tailchat-shared';
import { GroupPanelWrapper } from './Wrapper';

interface TextPanelProps {
  groupId: string;
  panelId: string;
}
export const TextPanel: React.FC<TextPanelProps> = React.memo(
  ({ groupId, panelId }) => {
    const groupMembers = useGroupMemberInfos(groupId);
    const panelInfo = useGroupPanel(groupId, panelId);
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
        >
          <ChatBox converseId={panelId} isGroup={true} groupId={groupId} />
        </ChatInputMentionsContextProvider>
      </GroupPanelWrapper>
    );
  }
);
TextPanel.displayName = 'TextPanel';
