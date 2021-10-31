import React, { useCallback, useEffect, useRef } from 'react';
import { useUpdateRef } from 'tailchat-shared';
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

    const handleScroll = useCallback(() => {
      if (props.messages.length === 0) {
        return;
      }

      if (containerRef.current?.scrollTop === 0) {
        onUpdateReadedMessageRef.current(
          props.messages[props.messages.length - 1]._id
        );
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
