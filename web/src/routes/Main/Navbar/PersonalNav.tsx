import { Avatar } from '@/components/Avatar';
import React from 'react';
import { t, useDMConverseList, useUserInfo } from 'tailchat-shared';
import { useUnread } from 'tailchat-shared/redux/hooks/useUnread';
import { NavbarNavItem } from './NavItem';

function usePersonalUnread(): boolean {
  const converse = useDMConverseList();
  const unreads = useUnread(converse.map((converse) => String(converse._id)));

  return unreads.some((u) => u === true);
}

export const PersonalNav: React.FC = React.memo(() => {
  const userInfo = useUserInfo();
  const unread = usePersonalUnread();

  return (
    <NavbarNavItem
      name={t('我')}
      to={'/main/personal'}
      showPill={true}
      badge={unread}
    >
      <Avatar
        shape="square"
        size={48}
        name={userInfo?.nickname}
        src={userInfo?.avatar}
      />
    </NavbarNavItem>
  );
});
PersonalNav.displayName = 'PersonalNav';
