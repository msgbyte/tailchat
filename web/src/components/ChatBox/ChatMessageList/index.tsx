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
      return <LoadingSpinner />;
    }

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
