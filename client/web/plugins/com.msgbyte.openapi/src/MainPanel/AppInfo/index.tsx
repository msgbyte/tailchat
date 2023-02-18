import React, { useMemo } from 'react';
import { SidebarView } from '@capital/component';
import { Loadable } from '@capital/common';
import { useOpenAppInfo } from '../context';
import { Translate } from '../../translate';
import './index.less';

// const Summary = Loadable(() => import('./Summary'));
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
          // {
          //   type: 'item',
          //   title: '总览',
          //   content: <Summary />,
          //   isDev: true,
          // },
          {
            type: 'item',
            title: Translate.app.basicInfo,
            content: <Profile />,
          },
          {
            type: 'item',
            title: Translate.app.bot,
            content: <Bot />,
          },
          {
            type: 'item',
            title: Translate.app.webpage,
            content: <Webpage />,
            isDev: true,
          },
          {
            type: 'item',
            title: Translate.app.oauth,
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
