import React from 'react';
import { GroupNav } from './GroupNav';
import { MobileMenuBtn } from './MobileMenuBtn';
import { SettingBtn } from './SettingBtn';
import { Divider } from 'antd';
import { PersonalNav } from './PersonalNav';
import { DevContainer } from '@/components/DevContainer';
import { InboxNav } from './InboxNav';
import { InstallBtn } from './InstallBtn';

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

      <div
        data-tc-role="navbar-settings"
        className="flex flex-col items-center space-y-2"
      >
        {/* 应用(PWA)安装按钮 */}
        <InstallBtn />

        {/* 设置按钮 */}
        <SettingBtn />
      </div>
    </div>
  );
});
Navbar.displayName = 'Navbar';
