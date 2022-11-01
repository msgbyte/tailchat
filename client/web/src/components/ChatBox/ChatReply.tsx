import React from 'react';
import { t, useChatBoxContext, useSharedEventHandler } from 'tailchat-shared';
import _isNil from 'lodash/isNil';
import { getMessageRender } from '@/plugin/common';
import { UserName } from '../UserName';
import { Icon } from 'tailchat-design';

export const ChatReply: React.FC = React.memo(() => {
  const { replyMsg, setReplyMsg, clearReplyMsg } = useChatBoxContext();

  useSharedEventHandler('replyMessage', (payload) => {
    /**
     * 这里故意在本组件设置回复消息体而不是在事件发起方设置是为了确保当本组件不存在时
     * 不会出现回复消息的值呗设置的情况
     */
    setReplyMsg(payload);
  });

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
