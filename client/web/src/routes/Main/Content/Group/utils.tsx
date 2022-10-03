import {
  pluginGroupPanelBadges,
  pluginGroupTextPanelExtraMenus,
} from '@/plugin/common';
import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import { Icon } from 'tailchat-design';
import {
  GroupPanel,
  GroupPanelType,
  isValidStr,
  useSharedEventHandler,
} from 'tailchat-shared';
import { useUpdate } from 'ahooks';

/**
 * 获取群组面板的参数
 */
export function useGroupPanelParams(): {
  groupId: string;
  panelId: string;
} {
  const { groupId = '', panelId = '' } = useParams<{
    groupId: string;
    panelId: string;
  }>();

  return { groupId, panelId };
}

/**
 * 获取来自插件的菜单项
 */
export function useExtraMenuItems(panel: GroupPanel): ItemType[] {
  const extraMenuItems = useMemo(() => {
    if (panel.type === GroupPanelType.TEXT) {
      return pluginGroupTextPanelExtraMenus;
    } else {
      return isValidStr(panel.pluginPanelName)
        ? findPluginPanelInfoByName(panel.pluginPanelName)?.menus ?? []
        : [];
    }
  }, [panel.type, panel.pluginPanelName]);

  if (Array.isArray(extraMenuItems) && extraMenuItems.length > 0) {
    return [
      {
        type: 'divider',
      },
      ...extraMenuItems.map((item) => ({
        key: item.name,
        label: item.label,
        icon: item.icon ? <Icon icon={item.icon} /> : undefined,
        onClick: () => item.onClick(panel),
      })),
    ];
  }

  return [];
}

/**
 * 获取群组面板额外badge
 */
export function useGroupPanelExtraBadge(
  groupId: string,
  panelId: string
): React.ReactNode[] {
  const update = useUpdate();

  useSharedEventHandler('groupPanelBadgeUpdate', () => {
    update();
  });

  const extraBadge = pluginGroupPanelBadges.map((item) => (
    <React.Fragment key={panelId + item.name}>
      {item.render(groupId, panelId)}
    </React.Fragment>
  ));

  return extraBadge;
}
