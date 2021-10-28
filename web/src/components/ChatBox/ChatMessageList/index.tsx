import React from 'react';
import {
  VirtualizedMessageList,
  VirtualizedMessageListProps,
} from './VirtualizedList';

export const ChatMessageList: React.FC<VirtualizedMessageListProps> =
  React.memo((props) => {
    return (
      <div className="flex-1">
        <VirtualizedMessageList {...props} />
      </div>
    );
  });
ChatMessageList.displayName = 'ChatMessageList';
