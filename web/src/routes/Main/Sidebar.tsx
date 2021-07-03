import React from 'react';
import clsx, { ClassValue } from 'clsx';
import { Icon } from '@iconify/react';
import { Avatar } from '../../components/Avatar';

const SidebarItem: React.FC<{
  className?: ClassValue;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}> = React.memo((props) => {
  return (
    <div
      className={clsx(
        'w-full hover:bg-white hover:bg-opacity-20 cursor-pointer text-white rounded px-2 h-11 flex items-center text-base group',
        props.className
      )}
    >
      <div className="flex h-8 items-center justify-center text-2xl w-8 mr-3">
        {props.icon}
      </div>
      <div className="flex-1">{props.children}</div>
      <div className="text-base p-1 cursor-pointer hidden opacity-70 group-hover:block hover:opacity-100">
        {props.action}
      </div>
    </div>
  );
});
SidebarItem.displayName = 'SidebarItem';

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
 * 侧边栏组件
 */
export const Sidebar: React.FC = React.memo(() => {
  return (
    <div className="w-60 bg-gray-800 p-2">
      {/* Sidebar */}
      <SidebarItem icon={<Icon icon="mdi-account-multiple" />}>
        好友
      </SidebarItem>
      <SidebarItem icon={<Icon icon="mdi-puzzle" />}>插件中心</SidebarItem>

      <SidebarSection action={<Icon icon="mdi-plus" />}>私信</SidebarSection>

      <SidebarItem
        icon={<Avatar name="用户" />}
        action={<Icon icon="mdi-close" />}
      >
        用户1
      </SidebarItem>
      <SidebarItem
        icon={<Avatar name="用户" />}
        action={<Icon icon="mdi-close" />}
      >
        用户1
      </SidebarItem>
      <SidebarItem
        icon={<Avatar name="用户" />}
        action={<Icon icon="mdi-close" />}
      >
        用户1
      </SidebarItem>
      <SidebarItem
        icon={<Avatar name="用户" />}
        action={<Icon icon="mdi-close" />}
      >
        用户1
      </SidebarItem>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';
