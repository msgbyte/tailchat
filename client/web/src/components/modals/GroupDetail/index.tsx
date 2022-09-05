import { FullModal } from '@/components/FullModal';
import {
  SidebarView,
  SidebarViewMenuItem,
  SidebarViewMenuType,
} from '@/components/SidebarView';
import { GroupIdContextProvider } from '@/context/GroupIdContext';
import { pluginCustomPanel } from '@/plugin/common';
import React, { useCallback, useMemo } from 'react';
import { PERMISSION, t, useHasGroupPermission } from 'tailchat-shared';
import { GroupInvite } from './Invite';
import { GroupPanel } from './Panel';
import { GroupRole } from './Role';
import { GroupSummary } from './Summary';
import _compact from 'lodash/compact';

interface SettingsViewProps {
  groupId: string;
  onClose: () => void;
}
export const GroupDetail: React.FC<SettingsViewProps> = React.memo((props) => {
  const groupId = props.groupId;
  const handleChangeVisible = useCallback(
    (visible) => {
      if (visible === false && typeof props.onClose === 'function') {
        props.onClose();
      }
    },
    [props.onClose]
  );
  const [allowManagePanel, allowManageInvite, allowManageRoles] =
    useHasGroupPermission(groupId, [
      PERMISSION.core.managePanel,
      PERMISSION.core.manageInvite,
      PERMISSION.core.manageRoles,
    ]);

  const menu: SidebarViewMenuType[] = useMemo(() => {
    // 内置
    const _menu: SidebarViewMenuType[] = [
      {
        type: 'group',
        title: t('通用'),
        children: _compact([
          {
            type: 'item',
            title: t('概述'),
            content: <GroupSummary groupId={groupId} />,
          },
          allowManagePanel && {
            type: 'item',
            title: t('面板'),
            content: <GroupPanel groupId={groupId} />,
          },
          allowManageInvite && {
            type: 'item',
            title: t('邀请码'),
            content: <GroupInvite groupId={groupId} />,
          },
          allowManageRoles && {
            type: 'item',
            title: t('身份组'),
            content: <GroupRole groupId={groupId} />,
          },
        ]),
      },
    ];

    // 插件
    const _pluginMenu: SidebarViewMenuItem[] = pluginCustomPanel
      .filter((p) => p.position === 'groupdetail')
      .map((p) => ({
        type: 'item',
        title: p.label,
        content: React.createElement(p.render),
      }));

    if (_pluginMenu.length > 0) {
      _menu.push({
        type: 'group',
        title: t('插件'),
        children: _pluginMenu,
      });
    }

    return _menu;
  }, []);

  return (
    <GroupIdContextProvider value={groupId}>
      <FullModal onChangeVisible={handleChangeVisible}>
        <SidebarView menu={menu} defaultContentPath="0.children.0.content" />
      </FullModal>
    </GroupIdContextProvider>
  );
});
GroupDetail.displayName = 'GroupDetail';
