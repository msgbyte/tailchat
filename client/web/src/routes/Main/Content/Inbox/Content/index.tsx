import { NotFound } from '@/components/NotFound';
import React from 'react';
import { useParams } from 'react-router';
import {
  model,
  t,
  useAppDispatch,
  useInboxItem,
  useWatch,
} from 'tailchat-shared';
import { chatActions } from 'tailchat-shared';
import { InboxMessageContent } from './Message';

/**
 * 收件箱主要界面
 */
export const InboxContent: React.FC = React.memo((props) => {
  const { inboxItemId } = useParams();
  const inboxItem = useInboxItem(inboxItemId ?? '');

  useInboxAck(inboxItemId ?? '');

  if (!inboxItem) {
    return <NotFound message={t('没有找到该记录')} />;
  }

  if (inboxItem.type === 'message') {
    return <InboxMessageContent info={inboxItem} />;
  }

  return <NotFound message={t('没有找到该类型的渲染方式')} />;
});
InboxContent.displayName = 'InboxContent';

function useInboxAck(inboxItemId: string) {
  const dispatch = useAppDispatch();
  const item = useInboxItem(inboxItemId);

  useWatch([inboxItemId], () => {
    if (!item) {
      return;
    }

    if (item.readed === false) {
      dispatch(chatActions.setInboxItemAck(inboxItemId));
      model.inbox.setInboxAck([inboxItemId]);
    }
  });
}
