import type { PluginCustomPanel } from '@/plugin/common';
import clsx from 'clsx';
import React from 'react';
import { Icon } from 'tailchat-design';
import { NavbarNavItem } from './NavItem';

/**
 * 导航栏自定义选项
 * 用于插件
 */
export const NavbarCustomNavItem: React.FC<{
  panelInfo: PluginCustomPanel;
  withBg: boolean;
}> = React.memo(({ panelInfo, withBg }) => {
  return (
    <NavbarNavItem
      key={panelInfo.name}
      name={panelInfo.label}
      className={clsx({ 'bg-gray-700': withBg })}
      to={`/main/custom/${panelInfo.name}`}
      data-testid={`navbar-custom-${panelInfo.name}`}
    >
      <Icon className="text-3xl text-white" icon={panelInfo.icon} />
    </NavbarNavItem>
  );
});
NavbarCustomNavItem.displayName = 'NavbarCustomNavItem';
