import React from 'react';
import { NormalMessageList } from './NormalList';
import type { MessageListProps } from './types';
// import { VirtualizedMessageList } from './VirtualizedList';
import { VirtualizedMessageList } from './VirtualizedList.new';

const useVirtualizedList = true; // 是否使用虚拟化列表

export const ChatMessageList: React.FC<MessageListProps> = React.memo(
  (props) => {
    return useVirtualizedList ? (
      <div className="flex-1">
        <VirtualizedMessageList {...props} />
      </div>
    ) : (
      <NormalMessageList {...props} />
    );
  }
);
ChatMessageList.displayName = 'ChatMessageList';
