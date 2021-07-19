import React from 'react';
import {
  ChatMessage,
  formatShortTime,
  useCachedUserInfo,
} from 'pawchat-shared';
import { Avatar } from '@/components/Avatar';
import clsx from 'clsx';

interface ChatMessageItemProps {
  showAvatar: boolean;
  payload: ChatMessage;
}
export const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo(
  (props) => {
    const { showAvatar, payload } = props;
    const userInfo = useCachedUserInfo(payload.author ?? '');

    return (
      <div
        className={clsx('flex px-2 group hover:bg-black hover:bg-opacity-10')}
      >
        <div className="w-18 flex items-center justify-center">
          {showAvatar ? (
            <Avatar size={40} src={userInfo.avatar} name={userInfo.nickname} />
          ) : (
            <div className="hidden group-hover:block opacity-40">
              {formatShortTime(payload.createdAt)}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {showAvatar && <div className="font-bold">{userInfo.nickname}</div>}

          <div className="leading-6">{payload.content}</div>
        </div>
      </div>
    );
  }
);
ChatMessageItem.displayName = 'ChatMessageItem';
