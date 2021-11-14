import React, { useRef } from 'react';
import { buildMessageItemRow } from './Item';
import type { MessageListProps } from './types';
import { Virtuoso, VirtuosoGridHandle } from 'react-virtuoso';

/**
 * 新版的虚拟列表
 */
export const VirtualizedMessageList: React.FC<MessageListProps> = React.memo(
  (props) => {
    const listRef = useRef<VirtuosoGridHandle>();
    const lastMessageId = useRef('');
    const handleLoadMore = () => {
      // TODO: 待修复， 这个方法只会被触发一次
      lastMessageId.current = props.messages[0]._id;
      props.onLoadMore().then(() => {
        listRef.current?.scrollToIndex(50);
      });

      return false;
    };

    return (
      <Virtuoso
        style={{ height: '100%' }}
        ref={listRef as any}
        initialTopMostItemIndex={props.messages.length - 1}
        data={props.messages}
        overscan={100}
        itemContent={(index, data) =>
          buildMessageItemRow(props.messages, data._id)
        }
        alignToBottom={true}
        startReached={handleLoadMore}
      />
    );
  }
);
VirtualizedMessageList.displayName = 'VirtualizedMessageList';
