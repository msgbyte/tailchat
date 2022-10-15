import React, { useCallback } from 'react';
import { VirtualChatList } from 'tailchat-design';
import { ChatMessage, useMemoizedFn } from 'tailchat-shared';
import { buildMessageItemRow } from './Item';
import type { MessageListProps } from './types';

/**
 * WIP:
 * 自制的虚拟列表
 */

const style: React.CSSProperties = {
  // height: '100%',
  flex: 1,
};

export const VirtualizedMessageList: React.FC<MessageListProps> = React.memo(
  (props) => {
    // useSharedEventHandler('sendMessage', () => {
    //   listRef.current?.scrollToIndex({
    //     index: 'LAST',
    //     align: 'end',
    //     behavior: 'smooth',
    //   });
    // });

    // const handleLoadMore = useMemoizedFn(() => {
    //   if (props.isLoadingMore) {
    //     return;
    //   }

    //   if (props.hasMoreMessage) {
    //     props.onLoadMore();
    //   }
    // });

    const itemContent = useMemoizedFn((item: ChatMessage, index: number) => {
      return buildMessageItemRow(props.messages, index);
    });

    const getItemKey = useCallback((item: ChatMessage) => {
      return String(item._id);
    }, []);

    return (
      <VirtualChatList
        style={style}
        items={props.messages}
        itemContent={itemContent}
        getItemKey={getItemKey}
      />
    );
  }
);
VirtualizedMessageList.displayName = 'VirtualizedMessageList';
