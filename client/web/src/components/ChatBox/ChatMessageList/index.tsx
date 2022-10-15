import { LoadingSpinner } from '@/components/LoadingSpinner';
import React from 'react';
import { useSingleUserSetting } from 'tailchat-shared';
import { NormalMessageList } from './NormalList';
import type { MessageListProps } from './types';
import { VirtualizedMessageList } from './VirtualizedList';

export const ChatMessageList: React.FC<MessageListProps> = React.memo(
  (props) => {
    const { value: useVirtualizedList, loading } = useSingleUserSetting(
      'messageListVirtualization',
      false
    );

    if (loading) {
      return (
        <div className="flex-1">
          <LoadingSpinner />
        </div>
      );
    }

    return useVirtualizedList ? (
      <VirtualizedMessageList {...props} />
    ) : (
      <NormalMessageList {...props} />
    );
  }
);
ChatMessageList.displayName = 'ChatMessageList';
