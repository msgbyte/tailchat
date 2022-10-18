import React, { useMemo, useState } from 'react';
import {
  ChatMessage,
  formatShortTime,
  shouldShowMessageTime,
  SYSTEM_USERID,
  t,
  useCachedUserInfo,
  MessageHelper,
  sharedEvent,
  showMessageTime,
} from 'tailchat-shared';
import { useRenderPluginMessageInterpreter } from './useRenderPluginMessageInterpreter';
import { getMessageRender, pluginMessageExtraParsers } from '@/plugin/common';
import { Divider, Dropdown } from 'antd';
import { UserName } from '@/components/UserName';
import clsx from 'clsx';
import { useChatMessageItemAction } from './useChatMessageItemAction';
import { useChatMessageReactionAction } from './useChatMessageReaction';
import { TcPopover } from '@/components/TcPopover';
import { useMessageReactions } from './useMessageReactions';
import { stopPropagation } from '@/utils/dom-helper';
import { useUserInfoList } from 'tailchat-shared/hooks/model/useUserInfoList';
import { AutoFolder, Avatar, Icon } from 'tailchat-design';
import { Intersection } from '@/components/Intersection';
import './Item.less';

/**
 * 消息引用
 */
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

const MessageActionIcon: React.FC<{ icon: string }> = (props) => (
  <div className="px-0.5 w-6 h-6 flex justify-center items-center opacity-60 hover:opacity-100">
    <Icon icon={props.icon} />
  </div>
);

/**
 * 普通消息
 */
const NormalMessage: React.FC<ChatMessageItemProps> = React.memo((props) => {
  const { showAvatar, payload } = props;
  const userInfo = useCachedUserInfo(payload.author ?? '');
  const [isActionBtnActive, setIsActionBtnActive] = useState(false);

  const reactions = useMessageReactions(payload);

  const emojiAction = useChatMessageReactionAction(payload);
  const moreActions = useChatMessageItemAction(payload, {
    onClick: () => {
      setIsActionBtnActive(false);
    },
  });

  return (
    <div
      className={clsx('chat-message-item flex px-2 group relative', {
        'bg-black bg-opacity-10': isActionBtnActive,
        'hover:bg-black hover:bg-opacity-10': !isActionBtnActive,
      })}
    >
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
      <div
        className="flex flex-col flex-1 overflow-auto group"
        onContextMenu={stopPropagation}
      >
        {showAvatar && (
          <div className="flex items-center">
            <div className="font-bold">{userInfo.nickname}</div>
            <div className="hidden group-hover:block opacity-40 ml-1 text-sm">
              {formatShortTime(payload.createdAt)}
            </div>
          </div>
        )}

        {/* 消息内容 */}
        <AutoFolder
          maxHeight={340}
          backgroundColor="var(--tc-content-background-color)"
          showFullText={
            <div className="inline-block rounded-full bg-white dark:bg-black opacity-80 py-2 px-3 hover:opacity-100">
              {t('点击展开更多')}
            </div>
          }
        >
          <div className="chat-message-item_body leading-6 break-words">
            <MessageQuote payload={payload} />

            <span>{getMessageRender(payload.content)}</span>

            {/* 解释器按钮 */}
            {useRenderPluginMessageInterpreter(payload.content)}
          </div>
        </AutoFolder>

        {/* 额外渲染 */}
        <div>
          {pluginMessageExtraParsers.map((parser) => (
            <React.Fragment key={parser.name}>
              {parser.render(payload)}
            </React.Fragment>
          ))}
        </div>

        {/* 消息反应 */}
        {reactions}
      </div>

      {/* 操作 */}
      <div
        className={clsx(
          'bg-white dark:bg-black rounded absolute right-2 cursor-pointer -top-3 shadow-sm flex',
          {
            'opacity-0 group-hover:opacity-100 bg-opacity-80 hover:bg-opacity-100':
              !isActionBtnActive,
            'opacity-100 bg-opacity-100': isActionBtnActive,
          }
        )}
      >
        <TcPopover
          overlayClassName="chat-message-item_action-popover"
          content={emojiAction}
          placement="bottomLeft"
          trigger={['click']}
          onVisibleChange={setIsActionBtnActive}
        >
          <div>
            <MessageActionIcon icon="mdi:emoticon-happy-outline" />
          </div>
        </TcPopover>

        <Dropdown
          overlay={moreActions}
          placement="bottomLeft"
          trigger={['click']}
          onVisibleChange={setIsActionBtnActive}
        >
          <div>
            <MessageActionIcon icon="mdi:dots-horizontal" />
          </div>
        </Dropdown>
      </div>
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

/**
 * 带userId => nickname异步解析的SystemMessage 组件
 */
const SystemMessageWithNickname: React.FC<
  ChatMessageItemProps & {
    userIds: string[];
    overwritePayload: (nicknameList: string[]) => ChatMessage;
  }
> = React.memo((props) => {
  const userInfos = useUserInfoList(props.userIds);
  const nicknameList = userInfos.map((user) => user.nickname);

  return (
    <SystemMessage {...props} payload={props.overwritePayload(nicknameList)} />
  );
});
SystemMessageWithNickname.displayName = 'SystemMessageWithNickname';

interface ChatMessageItemProps {
  showAvatar: boolean;
  payload: ChatMessage;
}
const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo((props) => {
  const payload = props.payload;
  if (payload.author === SYSTEM_USERID) {
    // 系统消息
    return <SystemMessage {...props} />;
  } else if (payload.hasRecall === true) {
    // 撤回消息
    return (
      <SystemMessageWithNickname
        {...props}
        userIds={[payload.author ?? SYSTEM_USERID]}
        overwritePayload={(nicknameList) => ({
          ...payload,
          content: t('{{nickname}} 撤回了一条消息', {
            nickname: nicknameList[0] || '',
          }),
        })}
      />
    );
  }

  // 普通消息
  return <NormalMessage {...props} />;
});
ChatMessageItem.displayName = 'ChatMessageItem';

/**
 * 构造聊天项
 */
export function buildMessageItemRow(messages: ChatMessage[], index: number) {
  const message = messages[index];

  if (!message) {
    return <div />;
  }

  let showDate = true;
  let showAvatar = true;
  const messageCreatedAt = new Date(message.createdAt ?? '');
  if (index > 0) {
    // 当不是第一条数据时

    // 进行时间合并
    const prevMessage = messages[index - 1];
    if (
      !shouldShowMessageTime(
        new Date(prevMessage.createdAt ?? ''),
        messageCreatedAt
      )
    ) {
      showDate = false;
    }

    // 进行头像合并(在同一时间块下 且发送者为同一人)
    if (showDate === false) {
      showAvatar =
        prevMessage.author !== message.author || prevMessage.hasRecall === true;
    }
  }

  return (
    <div key={message._id}>
      {showDate && (
        <Divider className="text-sm opacity-40 px-6 font-normal select-text">
          {showMessageTime(messageCreatedAt)}
        </Divider>
      )}

      <Intersection
        onIntersection={() => sharedEvent.emit('readMessage', message)}
      >
        <ChatMessageItem showAvatar={showAvatar} payload={message} />
      </Intersection>
    </div>
  );
}
