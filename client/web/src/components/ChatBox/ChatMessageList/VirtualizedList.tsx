import React, { useEffect, useMemo, useRef } from 'react';
import { buildMessageItemRow } from './Item';
import type { MessageListProps } from './types';
import {
  FollowOutputScalarType,
  Virtuoso,
  VirtuosoHandle,
} from 'react-virtuoso';
import { ChatMessage, sharedEvent, useMemoizedFn } from 'tailchat-shared';
import _last from 'lodash/last';

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
    const listRef = useRef<VirtuosoHandle>(null);
    const numItemsPrepended = usePrependedMessagesCount(props.messages);

    useEffect(() => {
      const onSendMessage = () => {
        listRef.current?.scrollToIndex({
          index: 'LAST',
          align: 'end',
          behavior: 'smooth',
        });
      };

      sharedEvent.on('sendMessage', onSendMessage);

      return () => {
        sharedEvent.off('sendMessage', onSendMessage);
      };
    }, []);

    const handleLoadMore = useMemoizedFn(() => {
      if (props.isLoadingMore) {
        return;
      }

      if (props.hasMoreMessage) {
        props.onLoadMore();
      }
    });

    const followOutput = useMemoizedFn(
      (isAtBottom: boolean): FollowOutputScalarType => {
        if (isAtBottom) {
          // 更新最新查看的消息id
          const lastMessage = _last(props.messages);
          if (lastMessage) {
            props.onUpdateReadedMessage(lastMessage._id);
          }

          setTimeout(() => {
            // 这里 Virtuoso 有个动态渲染高度的bug, 因此需要异步再次滚动到底部以确保代码功能work
            listRef.current?.scrollToIndex({
              index:
                PREPEND_OFFSET - numItemsPrepended + props.messages.length - 1,
              align: 'end',
            });
          }, 20);
        }

        /**
         * 如果有新的内容，且当前处于最底部时, 保持在最底部
         */
        return isAtBottom ? 'smooth' : false;
      }
    );

    const itemContent = (virtuosoIndex: number) => {
      const index = virtuosoIndex + numItemsPrepended - PREPEND_OFFSET;

      return buildMessageItemRow(props.messages, props.messages[index]._id);
    };

    return (
      <Virtuoso
        style={virtuosoStyle}
        ref={listRef}
        firstItemIndex={PREPEND_OFFSET - numItemsPrepended}
        initialTopMostItemIndex={Math.max(props.messages.length - 1, 0)}
        totalCount={props.messages.length}
        overscan={{
          main: 450,
          reverse: 450,
        }}
        itemContent={itemContent}
        alignToBottom={true}
        startReached={handleLoadMore}
        followOutput={followOutput}
        defaultItemHeight={25}
        atTopThreshold={100}
        atBottomThreshold={40}
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
