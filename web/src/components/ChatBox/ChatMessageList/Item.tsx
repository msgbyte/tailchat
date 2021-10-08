import React, { useMemo } from 'react';
import {
  ChatMessage,
  formatShortTime,
  SYSTEM_USERID,
  t,
  useCachedUserInfo,
  useChatBoxContext,
} from 'tailchat-shared';
import { Avatar } from '@/components/Avatar';
import { useRenderPluginMessageInterpreter } from './useRenderPluginMessageInterpreter';
import { getMessageRender } from '@/plugin/common';
import { Icon } from '@iconify/react';
import { Dropdown, Menu } from 'antd';
import { MessageHelper } from 'tailchat-shared';
import { UserName } from '@/components/UserName';
import './item.less';

/**
 * 消息的会话信息
 */
function useChatMessageItemAction(payload: ChatMessage): React.ReactElement {
  const context = useChatBoxContext();

  return (
    <Menu>
      {context.hasContext && (
        <Menu.Item key="reply" onClick={() => context.setReplyMsg(payload)}>
          {t('回复')}
        </Menu.Item>
      )}
    </Menu>
  );
}

const MessageQuote: React.FC<{ payload: ChatMessage }> = React.memo(
  ({ payload }) => {
    const quote = useMemo(
      () => new MessageHelper(payload).hasReply(),
      [payload]
    );

    if (quote === false) {
      return null;
    }

    return (
      <div className="chat-message-item_quote border-l-4 border-black border-opacity-20 pl-2 opacity-80">
        {t('回复')} <UserName userId={String(quote.author)} />:{' '}
        <span>{getMessageRender(quote.content)}</span>
      </div>
    );
  }
);
MessageQuote.displayName = 'MessageQuote';

/**
 * 普通消息
 */
const NormalMessage: React.FC<ChatMessageItemProps> = React.memo((props) => {
  const { showAvatar, payload } = props;
  const userInfo = useCachedUserInfo(payload.author ?? '');

  const actions = useChatMessageItemAction(payload);

  return (
    <div className="chat-message-item flex px-2 group hover:bg-black hover:bg-opacity-10 relative">
      {/* 头像 */}
      <div className="w-18 flex items-start justify-center pt-0.5">
        {showAvatar ? (
          <Avatar size={40} src={userInfo.avatar} name={userInfo.nickname} />
        ) : (
          <div className="hidden group-hover:block opacity-40">
            {formatShortTime(payload.createdAt)}
          </div>
        )}
      </div>

      {/* 主体 */}
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
          <MessageQuote payload={payload} />

          <span>{getMessageRender(payload.content)}</span>

          {/* 解释器按钮 */}
          {useRenderPluginMessageInterpreter(payload.content)}
        </div>
      </div>

      {/* 操作 */}
      <Dropdown overlay={actions} placement="bottomLeft" trigger={['click']}>
        <div className="opacity-0 group-hover:opacity-100 bg-black bg-opacity-5 hover:bg-opacity-10 rounded px-0.5 absolute right-2 top-0.5 cursor-pointer">
          <Icon icon="mdi:dots-horizontal" />
        </div>
      </Dropdown>
    </div>
  );
});
NormalMessage.displayName = 'NormalMessage';

/**
 * 系统消息
 */
const SystemMessage: React.FC<ChatMessageItemProps> = React.memo(
  ({ payload }) => {
    return (
      <div className="text-center">
        <div className="bg-black bg-opacity-20 rounded inline-block py-0.5 px-2 my-1 text-sm">
          {payload.content}
        </div>
      </div>
    );
  }
);
SystemMessage.displayName = 'SystemMessage';

interface ChatMessageItemProps {
  showAvatar: boolean;
  payload: ChatMessage;
}
export const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo(
  (props) => {
    if (props.payload.author === SYSTEM_USERID) {
      return <SystemMessage {...props} />;
    }

    return <NormalMessage {...props} />;
  }
);
ChatMessageItem.displayName = 'ChatMessageItem';
