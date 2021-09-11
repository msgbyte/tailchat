import React from 'react';
import { t, useAppSelector } from 'tailchat-shared';
import { Avatar } from '@/components/Avatar';
import { NavbarNavItem } from './NavItem';
import { GroupNav } from './GroupNav';
import { MobileMenuBtn } from './MobileMenuBtn';
import { SettingBtn } from './SettingBtn';
import { Divider } from 'antd';

/**
 * 导航栏组件
 */
export const Navbar: React.FC = React.memo(() => {
  const userInfo = useAppSelector((state) => state.user.info);

  return (
    <div className="w-18 bg-gray-900 flex flex-col justify-start items-center pt-4 pb-4">
      <MobileMenuBtn />

      {/* Navbar */}
      <div className="flex-1 w-full">
        <NavbarNavItem name={t('我')} to={'/main/personal'} showPill={true}>
          <Avatar
            shape="square"
            size={48}
            name={userInfo?.nickname}
            src={userInfo?.avatar}
          />
        </NavbarNavItem>

        <div className="px-3">
          <Divider />
        </div>

        <GroupNav />
      </div>

      <div>
        <SettingBtn />
      </div>
    </div>
  );
});
Navbar.displayName = 'Navbar';
