import React, { useMemo } from 'react';
import { CommonSidebarWrapper } from '@/components/CommonSidebarWrapper';
import { isValidStr, model, t, useInboxList } from 'tailchat-shared';
import clsx from 'clsx';
import _orderBy from 'lodash/orderBy';
import { GroupName } from '@/components/GroupName';
import { ConverseName } from '@/components/ConverseName';
import { getMessageRender } from '@/plugin/common';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

/**
 * 收件箱侧边栏组件
 */
export const InboxSidebar: React.FC = React.memo(() => {
  const inbox = useInboxList();
  const list = useMemo(() => _orderBy(inbox, 'createdAt', 'desc'), [inbox]);

  return (
    <CommonSidebarWrapper data-tc-role="sidebar-inbox">
      <div className="overflow-auto">
        {list.map((item) => {
          const { type } = item;

          if (type === 'message') {
            const message: Partial<model.inbox.InboxItem['message']> =
              item.message ?? {};
            let title: React.ReactNode = '';
            if (isValidStr(message.groupId)) {
              title = <GroupName groupId={message.groupId} />;
            } else if (isValidStr(message.converseId)) {
              title = <ConverseName converseId={message.converseId} />;
            }

            return (
              <InboxSidebarItem
                key={item._id}
                title={title}
                desc={getMessageRender(message.messageSnippet ?? '')}
                source={'Tailchat'}
                to={`/main/inbox/${item._id}`}
              />
            );
          }
        })}
      </div>
    </CommonSidebarWrapper>
  );
});
InboxSidebar.displayName = 'InboxSidebar';

const InboxSidebarItem: React.FC<{
  title: React.ReactNode;
  desc: React.ReactNode;
  source: string;
  to: string;
}> = React.memo((props) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(props.to);

  return (
    <Link to={props.to}>
      <div
        className={clsx(
          'p-2 overflow-auto cursor-pointer hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10',
          {
            'bg-black bg-opacity-10 dark:bg-white dark:bg-opacity-10': isActive,
          }
        )}
      >
        <div className="text-lg overflow-ellipsis overflow-hidden text-gray-700 dark:text-white">
          {props.title || <span>&nbsp;</span>}
        </div>
        <div className="break-all text-opacity-80 text-black dark:text-opacity-80 dark:text-white text-sm p-1 border-l-2 border-gray-500 border-opacity-50">
          {props.desc}
        </div>
        <div className="text-xs text-opacity-50 text-black dark:text-opacity-50 dark:text-white">
          {t('来自')}: {props.source}
        </div>
      </div>
    </Link>
  );
});
InboxSidebarItem.displayName = 'InboxSidebarItem';
