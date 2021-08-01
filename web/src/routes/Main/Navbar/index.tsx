import React from 'react';
import { t, useAppSelector } from 'tailchat-shared';
import { Icon } from '@iconify/react';
import { Avatar } from '@/components/Avatar';
import { NavbarNavItem } from './NavItem';
import { GroupNav } from './GroupNav';
import { MobileMenuBtn } from './MobileMenuBtn';

/**
 * 导航栏组件
 */
export const Navbar: React.FC = React.memo(() => {
  const userInfo = useAppSelector((state) => state.user.info);

  return (
    <div className="w-18 bg-gray-900 flex flex-col justify-start items-center pt-4 pb-4 p-1">
      <MobileMenuBtn />

      {/* Navbar */}
      <div className="flex-1">
        <NavbarNavItem name={t('我')} to={'/main/personal'}>
          <Avatar
            shape="square"
            size={48}
            name={userInfo?.nickname}
            src={userInfo?.avatar}
          />
        </NavbarNavItem>
        <div className="h-px w-full bg-white mt-4 mb-4"></div>

        <GroupNav />
      </div>
      <div>
        <Icon
          className="text-3xl text-white cursor-pointer"
          icon="mdi-dots-horizontal"
        />
      </div>
    </div>
  );
});
Navbar.displayName = 'Navbar';
