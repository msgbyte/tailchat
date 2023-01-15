import { Icon } from 'tailchat-design';
import React from 'react';
import { t, useInboxList } from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';

/**
 * 收件箱
 */
export const InboxNav: React.FC = React.memo(() => {
  const inbox = useInboxList();

  return (
    <NavbarNavItem
      className="bg-gray-700"
      name={t('收件箱')}
      to={'/main/inbox'}
      showPill={true}
      badge={inbox.filter((i) => !i.readed).length}
      data-testid="inbox"
    >
      <Icon className="text-3xl text-white" icon="mdi:inbox-arrow-down" />
    </NavbarNavItem>
  );
});
InboxNav.displayName = 'InboxNav';
