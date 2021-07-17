import React from 'react';
import type { ChatMessage } from 'pawchat-shared';
import { ChatMessageItem } from './Item';

interface ChatMessageListProps {
  messages: ChatMessage[];
}
export const ChatMessageList: React.FC<ChatMessageListProps> = React.memo(
  (props) => {
    return (
      <div className="flex-1 overflow-y-scroll">
        {props.messages.map((message) => (
          <ChatMessageItem
            key={message._id}
            showAvatar={true}
            payload={message}
          />
        ))}
      </div>
    );
  }
);
ChatMessageList.displayName = 'ChatMessageList';
