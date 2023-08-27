import React, { useMemo } from 'react';
import { Icon, SidebarView } from '@capital/component';
import { Loadable, useEvent } from '@capital/common';
import { useOpenAppInfo } from '../context';
import { Translate } from '../../translate';
import styled from 'styled-components';
import './index.less';

const MenuTitle = styled.div`
  display: flex;

  .iconify {
    margin-right: 4px;
    font-size: 16px;
    cursor: pointer;
  }
`;

// const Summary = Loadable(() => import('./Summary'));
const Profile = Loadable(() => import('./Profile'));
const Bot = Loadable(() => import('./Bot'));
const Webpage = Loadable(() => import('./Webpage'));
const OAuth = Loadable(() => import('./OAuth'));

const AppInfo: React.FC = React.memo(() => {
  const { appName, onSelectApp } = useOpenAppInfo();

  const handleBack = useEvent(() => {
    onSelectApp(null);
  });

  const menu = useMemo(
    () => [
      {
        type: 'group',
        title: (
          <MenuTitle>
            <Icon icon="mdi:arrow-left" onClick={handleBack} /> {appName}
          </MenuTitle>
        ),
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
