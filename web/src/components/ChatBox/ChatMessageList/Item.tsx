import React from 'react';
import { ChatMessage, useCachedUserInfo } from 'pawchat-shared';

interface ChatMessageItemProps {
  showAvatar: boolean;
  payload: ChatMessage;
}
export const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo(
  (props) => {
    const { showAvatar, payload } = props;
    const userInfo = useCachedUserInfo(payload.author ?? '');

    return (
      <div>
        {userInfo.nickname}: {payload.content}
      </div>
    );
  }
);
ChatMessageItem.displayName = 'ChatMessageItem';
