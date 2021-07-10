import React from 'react';
import { Icon } from '@iconify/react';
import { SidebarItem } from '../SidebarItem';

const SidebarSection: React.FC<{
  action: React.ReactNode;
}> = React.memo((props) => {
  return (
    <div className="h-10 text-white flex pt-4 px-2">
      <span className="flex-1 overflow-hidden overflow-ellipsis text-xs text-gray-300">
        {props.children}
      </span>
      <div className="text-base opacity-70 hover:opacity-100 cursor-pointer">
        {props.action}
      </div>
    </div>
  );
});
SidebarSection.displayName = 'SidebarSection';

/**
 * 个人面板侧边栏组件
 */
export const Sidebar: React.FC = React.memo(() => {
  return (
    <>
      <SidebarItem
        name="好友"
        icon={<Icon icon="mdi-account-multiple" />}
        to="/main/personal/friends"
      />
      <SidebarItem
        name="插件中心"
        icon={<Icon icon="mdi-puzzle" />}
        to="/main/personal/plugins"
      />

      <SidebarSection action={<Icon icon="mdi-plus" />}>私信</SidebarSection>

      <SidebarItem
        name="用户1"
        action={<Icon icon="mdi-close" />}
        to={`/main/personal/converse/${'uuid'}`}
      />
    </>
  );
});
Sidebar.displayName = 'Sidebar';
