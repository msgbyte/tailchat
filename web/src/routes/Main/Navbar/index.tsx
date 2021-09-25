import React from 'react';
import { GroupNav } from './GroupNav';
import { MobileMenuBtn } from './MobileMenuBtn';
import { SettingBtn } from './SettingBtn';
import { Divider } from 'antd';
import { PersonalNav } from './PersonalNav';

/**
 * 导航栏组件
 */
export const Navbar: React.FC = React.memo(() => {
  return (
    <div className="w-18 bg-navbar-light dark:bg-navbar-dark flex flex-col justify-start items-center pt-4 pb-4">
      <MobileMenuBtn />

      {/* Navbar */}
      <div className="flex-1 w-full">
        <PersonalNav />

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
