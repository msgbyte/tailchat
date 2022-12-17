import React from 'react';
import {
  groupActions,
  GroupPanel,
  GroupPanelType,
  isValidStr,
  showToasts,
  t,
  useAppDispatch,
  useConverseAck,
  useGroupInfo,
} from 'tailchat-shared';
import { GroupPanelItem } from '@/components/GroupPanelItem';
import { GroupTextPanelItem } from './TextPanelItem';
import { Dropdown, Menu, MenuProps } from 'antd';
import copy from 'copy-to-clipboard';
import { usePanelWindow } from '@/hooks/usePanelWindow';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import _compact from 'lodash/compact';
import { Icon } from 'tailchat-design';
import { useExtraMenuItems, useGroupPanelExtraBadge } from './utils';

/**
 * 群组面板侧边栏组件
 */
export const SidebarItem: React.FC<{
  groupId: string;
  panel: GroupPanel;
}> = React.memo((props) => {
  const { groupId, panel } = props;
  const panelId = panel.id;
  const { hasOpenedPanel, openPanelWindow } = usePanelWindow(
    `/panel/group/${groupId}/${panelId}`
  );
  const groupInfo = useGroupInfo(groupId);
  const dispatch = useAppDispatch();
  const { markConverseAllAck } = useConverseAck(panelId);
  const extraMenuItems = useExtraMenuItems(panel);
  const extraBadge = useGroupPanelExtraBadge(groupId, panelId);

  if (!groupInfo) {
    return <LoadingSpinner />;
  }

  const isPinned =
    isValidStr(groupInfo.pinnedPanelId) && groupInfo.pinnedPanelId === panelId;

  const menu: MenuProps = {
    items: _compact([
      {
        key: 'copy',
        label: t('复制链接'),
        icon: <Icon icon="mdi:content-copy" />,
        onClick: () => {
          copy(`${location.origin}/main/group/${groupId}/${panelId}`);
          showToasts(t('已复制到剪切板'));
        },
      },
      {
        key: 'new',
        label: t('在新窗口打开'),
        icon: <Icon icon="mdi:dock-window" />,
        disabled: hasOpenedPanel,
        onClick: openPanelWindow,
      },
      isPinned
        ? {
            key: 'unpin',
            label: t('Unpin'),
            icon: <Icon icon="mdi:pin-off" />,
            onClick: () => {
              dispatch(
                groupActions.unpinGroupPanel({
                  groupId,
                })
              );
            },
          }
        : {
            key: 'pin',
            label: t('Pin'),
            icon: <Icon icon="mdi:pin" />,
            onClick: () => {
              dispatch(
                groupActions.pinGroupPanel({
                  groupId,
                  panelId: panelId,
                })
              );
            },
          },
      panel.type === GroupPanelType.TEXT && {
        key: 'markAsRead',
        label: t('标记为已读'),
        icon: <Icon icon="mdi:message-badge-outline" />,
        onClick: markConverseAllAck,
      },
      ...extraMenuItems,
    ]),
  };

  const icon = isPinned ? <Icon icon="mdi:pin" /> : <Icon icon="mdi:pound" />;

  return (
    <Dropdown menu={menu} trigger={['contextMenu']}>
      <div>
        {panel.type === GroupPanelType.TEXT ? (
          <GroupTextPanelItem icon={icon} groupId={groupId} panel={panel} />
        ) : (
          <GroupPanelItem
            name={panel.name}
            icon={icon}
            to={`/main/group/${groupId}/${panelId}`}
            extraBadge={extraBadge}
          />
        )}
      </div>
    </Dropdown>
  );
});
SidebarItem.displayName = 'SidebarItem';
