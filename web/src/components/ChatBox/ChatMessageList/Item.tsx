import React, { useMemo } from 'react';
import {
  ChatMessage,
  formatShortTime,
  getMessageTimeDiff,
  shouldShowMessageTime,
  SYSTEM_USERID,
  t,
  useCachedUserInfo,
  useChatBoxContext,
  MessageHelper,
  recallMessage,
  useAsync,
  getCachedUserInfo,
  useAsyncRequest,
  deleteMessage,
  useGroupInfoContext,
  useUserInfo,
} from 'tailchat-shared';
import { Avatar } from '@/components/Avatar';
import { useRenderPluginMessageInterpreter } from './useRenderPluginMessageInterpreter';
import { getMessageRender } from '@/plugin/common';
import { Icon } from '@iconify/react';
import { Divider, Dropdown, Menu } from 'antd';
import { UserName } from '@/components/UserName';
import './item.less';

/**
 * 消息的会话操作
 */
function useChatMessageItemAction(payload: ChatMessage): React.ReactElement {
  const context = useChatBoxContext();
  const groupInfo = useGroupInfoContext();
  const userInfo = useUserInfo();

  const [, handleRecallMessage] = useAsyncRequest(() => {
    return recallMessage(payload._id);
  }, [payload._id]);

  const [, handleDeleteMessage] = useAsyncRequest(() => {
    return deleteMessage(payload._id);
  }, [payload._id]);

  const isGroupOwner = groupInfo && groupInfo.owner === userInfo?._id; //
  const isMessageAuthor = payload.author === userInfo?._id;

  return (
    <Menu>
      {context.hasContext && (
        <Menu.Item
          key="reply"
          icon={<Icon icon="mdi:reply" />}
          onClick={() => context.setReplyMsg(payload)}
        >
          {t('回复')}
        </Menu.Item>
      )}

      {(isGroupOwner || isMessageAuthor) && (
        <Menu.Item
          key="recall"
          icon={<Icon icon="mdi:restore" />}
          onClick={handleRecallMessage}
        >
          {t('撤回')}
        </Menu.Item>
      )}

      {/* 仅群组管理员可见 */}
      {isGroupOwner && (
        <Menu.Item
          key="delete"
          danger={true}
          icon={<Icon icon="mdi:delete-outline" />}
          onClick={handleDeleteMessage}
        >
          {t('删除')}
        </Menu.Item>
      )}
    </Menu>
  );
}

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
        <div className="opacity-0 group-hover:opacity-100 bg-white dark:bg-black bg-opacity-80 hover:bg-opacity-100 rounded px-0.5 absolute right-2 cursor-pointer w-6 h-6 -top-3 flex justify-center items-center shadow-sm">
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

/**
 * 带userId => nickname异步解析的SystemMessage 组件
 */
const SystemMessageWithNickname: React.FC<
  ChatMessageItemProps & {
    userIds: string[];
    overwritePayload: (nicknameList: string[]) => ChatMessage;
  }
> = React.memo((props) => {
  const { value: nicknameList = [] } = useAsync(() => {
    return Promise.all(
      props.userIds.map((userId) =>
        getCachedUserInfo(userId).then((u) => u.nickname)
      )
    );
  }, [props.userIds.join(',')]);

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
    return <SystemMessage {...props} />;
  } else if (payload.hasRecall === true) {
    return (
      <SystemMessageWithNickname
        {...props}
        userIds={[payload.author ?? SYSTEM_USERID]}
        overwritePayload={(nickname) => ({
          ...payload,
          content: t('{{nickname}} 撤回了一条消息', {
            nickname: nickname[0] ?? '',
          }),
        })}
      />
    );
  }

  return <NormalMessage {...props} />;
});
ChatMessageItem.displayName = 'ChatMessageItem';

function findMessageIndexWithId(
  messages: ChatMessage[],
  messageId: string
): number {
  return messages.findIndex((m) => m._id === messageId);
}

/**
 * 构造聊天项
 */
export function buildMessageItemRow(
  messages: ChatMessage[],
  messageId: string
) {
  const index = findMessageIndexWithId(messages, messageId); // TODO: 这里是因为mattermost的动态列表传的id因此只能这边再用id找回，可以看看是否可以优化
  if (index === -1) {
    return <div />;
  }

  const message = messages[index];

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
}
