import React from 'react';
import type { MessageListProps } from './types';
import { VirtualizedMessageList } from './VirtualizedList';

export const ChatMessageList: React.FC<MessageListProps> = React.memo(
  (props) => {
    return (
      <div className="flex-1">
        <VirtualizedMessageList {...props} />
      </div>
    );
  }
);
ChatMessageList.displayName = 'ChatMessageList';
