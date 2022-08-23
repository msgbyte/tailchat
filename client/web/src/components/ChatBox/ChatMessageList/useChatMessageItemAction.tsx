import { Icon } from '@/components/Icon';
import { Menu } from 'antd';
import React, { useCallback } from 'react';
import {
  ChatMessage,
  deleteMessage,
  recallMessage,
  sharedEvent,
  t,
  useAsyncRequest,
  useChatBoxContext,
  useGroupInfoContext,
  useUserInfo,
} from 'tailchat-shared';
import { openReconfirmModalP } from '@/components/Modal';
import copy from 'copy-to-clipboard';
import { getMessageTextDecorators } from '@/plugin/common';

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

  const handleCopy = useCallback(() => {
    copy(getMessageTextDecorators().serialize(payload.content));
  }, [payload.content]);

  const [, handleRecallMessage] = useAsyncRequest(async () => {
    if (await openReconfirmModalP()) {
      await recallMessage(payload._id);
    }
  }, [payload._id]);

  const [, handleDeleteMessage] = useAsyncRequest(async () => {
    if (await openReconfirmModalP()) {
      await deleteMessage(payload._id);
    }
  }, [payload._id]);

  const isGroupOwner = groupInfo && groupInfo.owner === userInfo?._id; //
  const isMessageAuthor = payload.author === userInfo?._id;

  return (
    <Menu onClick={options.onClick}>
      <Menu.Item
        key="copy"
        icon={<Icon icon="mdi:content-copy" />}
        onClick={handleCopy}
      >
        {t('复制')}
      </Menu.Item>

      {context.hasContext && (
        <Menu.Item
          key="reply"
          icon={<Icon icon="mdi:reply" />}
          onClick={() => sharedEvent.emit('replyMessage', payload)}
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
