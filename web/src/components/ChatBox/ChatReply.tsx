import React from 'react';
import { t, useChatBoxContext } from 'tailchat-shared';
import _isNil from 'lodash/isNil';
import { getMessageRender } from '@/plugin/common';
import { UserName } from '../UserName';
import { Icon } from '@iconify/react';

export const ChatReply: React.FC = React.memo(() => {
  const { replyMsg, clearReplyMsg } = useChatBoxContext();

  if (_isNil(replyMsg)) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-0 right-0 py-1 px-4">
        <div className="rounded bg-white dark:bg-gray-800 p-2 max-h-44 overflow-auto shadow-sm relative">
          <span className="align-top">
            {t('回复')}{' '}
            {replyMsg.author && <UserName userId={replyMsg.author} />}:{' '}
          </span>

          <span>{getMessageRender(replyMsg.content)}</span>

          <Icon
            className="absolute right-1 top-0.5 text-lg cursor-pointer opacity-60 hover:opacity-80"
            icon="mdi:close-circle-outline"
            onClick={clearReplyMsg}
          />
        </div>
      </div>
    </div>
  );
});
ChatReply.displayName = 'ChatReply';
