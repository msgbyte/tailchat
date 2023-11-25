import type { PluginCustomPanel } from '@/plugin/common';
import React, { useMemo } from 'react';
import { Icon } from 'tailchat-design';
import { SidebarItem } from './SidebarItem';

const defaultUseIsShow = () => true;

/**
 * 导航栏自定义选项
 * 用于插件
 */
export const CustomSidebarItem: React.FC<{
  panelInfo: PluginCustomPanel;
}> = React.memo(({ panelInfo }) => {
  const useIsShow = useMemo(() => panelInfo.useIsShow ?? defaultUseIsShow, []);
  const isShow = useIsShow();

  if (!isShow) {
    return null;
  }

  return (
    <SidebarItem
      key={panelInfo.name}
      name={panelInfo.label}
      icon={<Icon icon={panelInfo.icon} />}
      to={`/main/personal/custom/${panelInfo.name}`}
    />
  );
});
CustomSidebarItem.displayName = 'CustomSidebarItem';
