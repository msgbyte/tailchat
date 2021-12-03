import { Icon } from '@iconify/react';
import { Menu } from 'antd';
import React from 'react';
import {
  ChatMessage,
  deleteMessage,
  recallMessage,
  t,
  useAsyncRequest,
  useChatBoxContext,
  useGroupInfoContext,
  useUserInfo,
} from 'tailchat-shared';

/**
 * 消息的会话操作
 */
export function useChatMessageItemAction(
  payload: ChatMessage,
  options: { onClick?: () => void }
): React.ReactElement {
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
    <Menu onClick={options.onClick}>
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
