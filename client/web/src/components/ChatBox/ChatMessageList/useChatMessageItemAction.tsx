import { Icon } from 'tailchat-design';
import { Menu, MenuProps } from 'antd';
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
import _compact from 'lodash/compact';

/**
 * 消息的会话操作
 */
export function useChatMessageItemAction(
  payload: ChatMessage,
  options: { onClick?: () => void }
): MenuProps {
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

  return {
    items: _compact([
      {
        key: 'copy',
        label: t('复制'),
        icon: <Icon icon="mdi:content-copy" />,
        onClick: handleCopy,
      },
      context.hasContext && {
        key: 'reply',
        label: t('回复'),
        icon: <Icon icon="mdi:reply" />,
        onClick: () => sharedEvent.emit('replyMessage', payload),
      },
      (isGroupOwner || isMessageAuthor) && {
        key: 'recall',
        label: t('撤回'),
        icon: <Icon icon="mdi:restore" />,
        onClick: handleRecallMessage,
      },
      isGroupOwner && {
        key: 'delete',
        label: t('删除'),
        danger: true,
        icon: <Icon icon="mdi:delete-outline" />,
        onClick: handleDeleteMessage,
      },
    ] as MenuProps['items']),
  };
}
