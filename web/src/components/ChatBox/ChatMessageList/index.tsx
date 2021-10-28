import React from 'react';
import {
  VirtualizedMessageList,
  VirtualizedMessageListProps,
} from './VirtualizedList';

export const ChatMessageList: React.FC<VirtualizedMessageListProps> =
  React.memo((props) => {
    return (
      <div className="flex-1">
        <VirtualizedMessageList
          messages={props.messages}
          onUpdateReadedMessage={props.onUpdateReadedMessage}
        />
      </div>
    );
  });
ChatMessageList.displayName = 'ChatMessageList';
