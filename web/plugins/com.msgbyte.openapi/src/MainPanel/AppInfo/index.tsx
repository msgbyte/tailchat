import React, { useMemo } from 'react';
import { SidebarView } from '@capital/component';
import { Loadable } from '@capital/common';
import { useOpenAppInfo } from '../context';
import './index.less';

const Summary = Loadable(() => import('./Summary'));
const Profile = Loadable(() => import('./Profile'));
const Bot = Loadable(() => import('./Bot'));
const Webpage = Loadable(() => import('./Webpage'));
const OAuth = Loadable(() => import('./OAuth'));

const AppInfo: React.FC = React.memo(() => {
  const { appName } = useOpenAppInfo();

  const menu = useMemo(
    () => [
      {
        type: 'group',
        title: appName,
        children: [
          {
            type: 'item',
            title: '总览',
            content: <Summary />,
          },
          {
            type: 'item',
            title: '基础信息',
            content: <Profile />,
          },
          {
            type: 'item',
            title: '机器人',
            content: <Bot />,
          },
          {
            type: 'item',
            title: '网页',
            content: <Webpage />,
          },
          {
            type: 'item',
            title: '应用登录',
            content: <OAuth />,
          },
        ],
      },
    ],
    []
  );

  return (
    <div className="plugin-openapi-app-info">
      <SidebarView menu={menu} defaultContentPath="0.children.0.content" />
    </div>
  );
});
AppInfo.displayName = 'AppInfo';

export default AppInfo;
