import React, { useEffect, useRef } from 'react';
import {
  ChatMessage,
  getMessageTimeDiff,
  shouldShowMessageTime,
} from 'tailchat-shared';
import { ChatMessageItem } from './Item';
import { Divider } from 'antd';

interface ChatMessageListProps {
  messages: ChatMessage[];
}
export const ChatMessageList: React.FC<ChatMessageListProps> = React.memo(
  (props) => {
    const ref = useRef<HTMLDivElement>(null);
    const len = props.messages.length;

    useEffect(() => {
      // 当会话消息增加时, 滚动到底部
      requestAnimationFrame(() => {
        if (ref.current === null) {
          return;
        }

        ref.current.scrollTo({
          top: ref.current.clientHeight,
          behavior: 'smooth',
        });
      });
    }, [len]);

    return (
      <div className="flex-1 overflow-y-scroll" ref={ref}>
        {props.messages.map((message, index, arr) => {
          let showDate = true;
          let showAvatar = true;
          const messageCreatedAt = new Date(message.createdAt ?? '');
          if (index > 0) {
            // 当不是第一条数据时

            // 进行时间合并
            const prevMessage = arr[index - 1];
            if (
              !shouldShowMessageTime(
                new Date(prevMessage.createdAt ?? ''),
                messageCreatedAt
              )
            ) {
              showDate = false;
            }

            // 进行头像合并(在同一时间块下)
            if (showDate === false) {
              showAvatar = prevMessage.author !== message.author;
            }
          }

          return (
            <div key={message._id}>
              {showDate && (
                <Divider className="text-sm opacity-40 px-6 font-normal select-none">
                  {getMessageTimeDiff(messageCreatedAt)}
                </Divider>
              )}
              <ChatMessageItem showAvatar={showAvatar} payload={message} />
            </div>
          );
        })}
      </div>
    );
  }
);
ChatMessageList.displayName = 'ChatMessageList';
