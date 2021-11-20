import React, { useDebugValue, useMemo, useRef } from 'react';
import { buildMessageItemRow } from './Item';
import type { MessageListProps } from './types';
import {
  FollowOutputScalarType,
  Virtuoso,
  VirtuosoGridHandle,
} from 'react-virtuoso';
import type { ChatMessage } from 'tailchat-shared';

const PREPEND_OFFSET = 10 ** 7;

const virtuosoStyle: React.CSSProperties = {
  height: '100%',
};

/**
 * 新版的虚拟列表
 * 参考: https://github.com/GetStream/stream-chat-react/blob/master/src/components/MessageList/VirtualizedMessageList.tsx
 */
export const VirtualizedMessageList: React.FC<MessageListProps> = React.memo(
  (props) => {
    const listRef = useRef<VirtuosoGridHandle>();
    const lastMessageId = useRef('');
    const numItemsPrepended = usePrependedMessagesCount(props.messages);
    useDebugValue(numItemsPrepended);

    const handleLoadMore = () => {
      lastMessageId.current = props.messages[0]._id;
      props.onLoadMore().then(() => {
        listRef.current?.scrollToIndex(50);
      });
    };

    const followOutput = (isAtBottom: boolean): FollowOutputScalarType => {
      /**
       * 如果有新的内容，且当前处于最底部时, 保持在最底部
       */
      return isAtBottom ? 'smooth' : false;
    };

    const itemContent = (virtuosoIndex: number) => {
      const index = virtuosoIndex + numItemsPrepended - PREPEND_OFFSET;

      return buildMessageItemRow(props.messages, props.messages[index]._id);
    };

    return (
      <Virtuoso
        style={virtuosoStyle}
        ref={listRef as any}
        firstItemIndex={PREPEND_OFFSET - numItemsPrepended}
        initialTopMostItemIndex={Math.max(props.messages.length - 1, 0)}
        totalCount={props.messages.length}
        overscan={200}
        itemContent={itemContent}
        alignToBottom={true}
        startReached={handleLoadMore}
        followOutput={followOutput}
      />
    );
  }
);
VirtualizedMessageList.displayName = 'VirtualizedMessageList';

function usePrependedMessagesCount(messages: ChatMessage[]) {
  const currentFirstMessageId = messages?.[0]?._id;
  const firstMessageId = useRef(currentFirstMessageId);
  const earliestMessageId = useRef(currentFirstMessageId);
  const previousNumItemsPrepended = useRef(0);

  const numItemsPrepended = useMemo(() => {
    if (!messages || !messages.length) {
      return 0;
    }
    // if no new messages were prepended, return early (same amount as before)
    if (currentFirstMessageId === earliestMessageId.current) {
      return previousNumItemsPrepended.current;
    }

    if (!firstMessageId.current) {
      firstMessageId.current = currentFirstMessageId;
    }
    earliestMessageId.current = currentFirstMessageId;
    // if new messages were prepended, find out how many
    // start with this number because there cannot be fewer prepended items than before
    for (
      let i = previousNumItemsPrepended.current;
      i < messages.length;
      i += 1
    ) {
      if (messages[i]._id === firstMessageId.current) {
        previousNumItemsPrepended.current = i;
        return i;
      }
    }
    return 0;
    // TODO: there's a bug here, the messages prop is the same array instance (something mutates it)
    // that's why the second dependency is necessary
  }, [messages, messages?.length]);

  return numItemsPrepended;
}
