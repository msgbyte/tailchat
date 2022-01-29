import React, { useState } from 'react';
import { Menu } from '@capital/component';
import { Loadable } from '@capital/common';
import { useOpenAppInfo } from '../context';
import './index.less';

const menuRouteMap: Record<string, React.ComponentType> = {
  summary: Loadable(() => import('./Summary')),
  profile: Loadable(() => import('./Profile')),
  bot: Loadable(() => import('./Bot')),
  webpage: Loadable(() => import('./Webpage')),
};

const AppInfo: React.FC = React.memo(() => {
  const [menu, setMenu] = useState('summary');

  return (
    <div className="plugin-openapi-app-info">
      <Menu
        style={{ width: 256 }}
        selectedKeys={[menu]}
        onSelect={({ key }) => setMenu(key)}
      >
        <Menu.Item key="summary">总览</Menu.Item>
        <Menu.Item key="profile">基础信息</Menu.Item>
        <Menu.Item key="bot">机器人</Menu.Item>
        <Menu.Item key="webpage">网页</Menu.Item>
      </Menu>

      <div>
        {menuRouteMap[menu] ? React.createElement(menuRouteMap[menu]) : <div />}
      </div>
    </div>
  );
});
AppInfo.displayName = 'AppInfo';

export default AppInfo;
