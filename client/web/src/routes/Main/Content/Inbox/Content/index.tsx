import { NotFound } from '@/components/NotFound';
import { pluginInboxItemMap } from '@/plugin/common';
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
    return (
      <div className="w-full">
        <NotFound message={t('没有找到该记录')} />
      </div>
    );
  }

  if (inboxItem.type === 'message') {
    return <InboxMessageContent info={inboxItem} />;
  } else if (pluginInboxItemMap[inboxItem.type]) {
    const info = pluginInboxItemMap[inboxItem.type];
    const Component = info.render;

    return <Component inboxItem={inboxItem} />;
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
