import React, { useCallback, useEffect, useRef } from 'react';
import { sharedEvent, useUpdateRef } from 'tailchat-shared';
import { buildMessageItemRow } from './Item';
import type { MessageListProps } from './types';

/**
 * 没有虚拟化版本的聊天列表
 */
export const NormalMessageList: React.FC<MessageListProps> = React.memo(
  (props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const onUpdateReadedMessageRef = useUpdateRef(props.onUpdateReadedMessage);
    useEffect(() => {
      if (props.messages.length === 0) {
        return;
      }

      if (containerRef.current?.scrollTop === 0) {
        // 当前列表在最低
        onUpdateReadedMessageRef.current(
          props.messages[props.messages.length - 1]._id
        );
      }
    }, [props.messages.length]);

    useEffect(() => {
      const onSendMessage = () => {
        // 滚动到底部
        containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      };

      sharedEvent.on('sendMessage', onSendMessage);

      return () => {
        sharedEvent.off('sendMessage', onSendMessage);
      };
    }, []);

    const handleScroll = useCallback(() => {
      if (props.messages.length === 0) {
        return;
      }

      if (!containerRef.current) {
        return;
      }

      if (containerRef.current.scrollTop === 0) {
        onUpdateReadedMessageRef.current(
          props.messages[props.messages.length - 1]._id
        );
      } else if (
        -containerRef.current.scrollTop + containerRef.current.clientHeight ===
        containerRef.current.scrollHeight
      ) {
        // 滚动条碰触到最顶部
        props.onLoadMore();
      }
    }, [props.messages]);

    return (
      <div
        className="flex-1 overflow-y-scroll flex flex-col-reverse"
        ref={containerRef}
        onScroll={handleScroll}
      >
        <div>
          {props.messages.map((message, index, arr) =>
            buildMessageItemRow(arr, message._id)
          )}
        </div>
      </div>
    );
  }
);
NormalMessageList.displayName = 'NormalMessageList';
