import React from 'react';
import { GroupNav } from './GroupNav';
import { MobileMenuBtn } from './MobileMenuBtn';
import { SettingBtn } from './SettingBtn';
import { Divider } from 'antd';
import { PersonalNav } from './PersonalNav';
import { InboxNav } from './InboxNav';
import { InstallBtn } from './InstallBtn';
import { ReactQueryDevBtn } from './ReactQueryDevBtn';
import { pluginCustomPanel } from '@/plugin/common';
import { NavbarCustomNavItem } from './CustomNavItem';

/**
 * 导航栏组件
 */
export const Navbar: React.FC = React.memo(() => {
  return (
    <div
      data-tc-role="navbar"
      className="w-18 mobile:zoom-4/5 bg-navbar-light dark:bg-navbar-dark flex flex-col justify-start items-center pt-4 pb-4"
    >
      <MobileMenuBtn />

      {/* Navbar */}
      <div className="flex-1 w-full overflow-hidden flex flex-col">
        <div className="space-y-2">
          <PersonalNav />

          <InboxNav />

          {pluginCustomPanel
            .filter((p) => p.position === 'navbar-personal')
            .map((p) => (
              <NavbarCustomNavItem key={p.name} panelInfo={p} withBg={true} />
            ))}
        </div>

        <div className="px-3">
          <Divider />
        </div>

        {/* 如果导航栏高度不够就缩减群组列表的高度 */}
        <div className="overflow-y-hidden hover:overflow-y-smart scroll overflow-x-hidden thin-scrollbar">
          <GroupNav />
        </div>

        {pluginCustomPanel
          .filter((p) => p.position === 'navbar-group')
          .map((p) => (
            <NavbarCustomNavItem key={p.name} panelInfo={p} withBg={true} />
          ))}
      </div>

      <div
        data-tc-role="navbar-settings"
        className="flex flex-col items-center space-y-2"
      >
        {pluginCustomPanel
          .filter((p) => p.position === 'navbar-more')
          .map((p) => (
            <NavbarCustomNavItem key={p.name} panelInfo={p} withBg={false} />
          ))}

        {/* React Query 的调试面板 */}
        <ReactQueryDevBtn />

        {/* 应用(PWA)安装按钮 */}
        <InstallBtn />

        {/* 设置按钮 */}
        <SettingBtn />
      </div>
    </div>
  );
});
Navbar.displayName = 'Navbar';
