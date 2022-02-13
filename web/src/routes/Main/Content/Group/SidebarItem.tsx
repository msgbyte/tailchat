import React from 'react';
import {
  groupActions,
  GroupPanel,
  GroupPanelType,
  isValidStr,
  showToasts,
  t,
  useAppDispatch,
  useGroupInfo,
} from 'tailchat-shared';
import { GroupPanelItem } from '@/components/GroupPanelItem';
import { GroupTextPanelItem } from './TextPanelItem';
import { Dropdown, Menu } from 'antd';
import copy from 'copy-to-clipboard';
import { usePanelWindow } from '@/hooks/usePanelWindow';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Icon } from '@/components/Icon';

/**
 * 群组面板侧边栏组件
 */
export const SidebarItem: React.FC<{
  groupId: string;
  panel: GroupPanel;
}> = React.memo((props) => {
  const { groupId, panel } = props;
  const { hasOpenedPanel, openPanelWindow } = usePanelWindow(
    `/panel/group/${groupId}/${panel.id}`
  );
  const groupInfo = useGroupInfo(groupId);
  const dispatch = useAppDispatch();

  if (!groupInfo) {
    return <LoadingSpinner />;
  }

  const isPinned =
    isValidStr(groupInfo.pinnedPanelId) && groupInfo.pinnedPanelId === panel.id;

  const menu = (
    <Menu>
      <Menu.Item
        icon={<Icon icon="mdi:content-copy" />}
        onClick={() => {
          copy(`${location.origin}/main/group/${groupId}/${panel.id}`);
          showToasts(t('已复制到剪切板'));
        }}
      >
        {t('复制链接')}
      </Menu.Item>

      <Menu.Item
        icon={<Icon icon="mdi:dock-window" />}
        disabled={hasOpenedPanel}
        onClick={openPanelWindow}
      >
        {t('在新窗口打开')}
      </Menu.Item>

      {isPinned ? (
        <Menu.Item
          icon={<Icon icon="mdi:pin-off" />}
          onClick={() => {
            dispatch(
              groupActions.unpinGroupPanel({
                groupId,
              })
            );
          }}
        >
          {t('Unpin')}
        </Menu.Item>
      ) : (
        <Menu.Item
          icon={<Icon icon="mdi:pin" />}
          onClick={() => {
            dispatch(
              groupActions.pinGroupPanel({
                groupId,
                panelId: panel.id,
              })
            );
          }}
        >
          {t('Pin')}
        </Menu.Item>
      )}
    </Menu>
  );

  const icon = isPinned ? <Icon icon="mdi:pin" /> : <Icon icon="mdi:pound" />;

  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <div>
        {panel.type === GroupPanelType.TEXT ? (
          <GroupTextPanelItem icon={icon} groupId={groupId} panel={panel} />
        ) : (
          <GroupPanelItem
            name={panel.name}
            icon={icon}
            to={`/main/group/${groupId}/${panel.id}`}
          />
        )}
      </div>
    </Dropdown>
  );
});
SidebarItem.displayName = 'SidebarItem';
