import React from 'react';
import { GroupNav } from './GroupNav';
import { MobileMenuBtn } from './MobileMenuBtn';
import { SettingBtn } from './SettingBtn';
import { Divider } from 'antd';
import { PersonalNav } from './PersonalNav';
import { DevContainer } from '@/components/DevContainer';
import { InboxNav } from './InboxNav';

/**
 * 导航栏组件
 */
export const Navbar: React.FC = React.memo(() => {
  return (
    <div
      data-tc-role="navbar"
      className="w-18 bg-navbar-light dark:bg-navbar-dark flex flex-col justify-start items-center pt-4 pb-4"
    >
      <MobileMenuBtn />

      {/* Navbar */}
      <div className="flex-1 w-full">
        <div className="space-y-2">
          <PersonalNav />

          <DevContainer>
            <InboxNav />
          </DevContainer>
        </div>

        <div className="px-3">
          <Divider />
        </div>

        <GroupNav />
      </div>

      <div data-tc-role="navbar-settings">
        <SettingBtn />
      </div>
    </div>
  );
});
Navbar.displayName = 'Navbar';
