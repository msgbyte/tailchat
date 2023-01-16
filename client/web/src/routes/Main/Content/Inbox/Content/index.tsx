import { NotFound } from '@/components/NotFound';
import React from 'react';
import { useParams } from 'react-router';
import { t, useInboxItem } from 'tailchat-shared';
import { InboxMessageContent } from './Message';

export const InboxContent: React.FC = React.memo((props) => {
  const { inboxItemId } = useParams();
  const inboxItem = useInboxItem(inboxItemId ?? '');

  if (!inboxItem) {
    return <NotFound message={t('没有找到该记录')} />;
  }

  if (inboxItem.type === 'message') {
    return <InboxMessageContent info={inboxItem} />;
  }

  return <NotFound message={t('没有找到该类型的渲染方式')} />;
});
InboxContent.displayName = 'InboxContent';
