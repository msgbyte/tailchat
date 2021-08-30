import React from 'react';
import {
  ChatMessage,
  formatShortTime,
  useCachedUserInfo,
} from 'tailchat-shared';
import { Avatar } from '@/components/Avatar';
import clsx from 'clsx';
import { useRenderPluginMessageInterpreter } from './useRenderPluginMessageInterpreter';
import { getMessageRender } from '@/plugin/common';

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
        <div className="w-18 flex items-start justify-center pt-0.5">
          {showAvatar ? (
            <Avatar size={40} src={userInfo.avatar} name={userInfo.nickname} />
          ) : (
            <div className="hidden group-hover:block opacity-40">
              {formatShortTime(payload.createdAt)}
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 overflow-auto group">
          {showAvatar && (
            <div className="flex items-center">
              <div className="font-bold">{userInfo.nickname}</div>
              <div className="hidden group-hover:block opacity-40 ml-1 text-sm">
                {formatShortTime(payload.createdAt)}
              </div>
            </div>
          )}

          <div className="leading-6 break-words">
            <span>{getMessageRender(payload.content)}</span>

            {/* 解释器按钮 */}
            {useRenderPluginMessageInterpreter(payload.content)}
          </div>
        </div>
      </div>
    );
  }
);
ChatMessageItem.displayName = 'ChatMessageItem';
