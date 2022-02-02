import React from 'react';
import { GroupPanel, GroupPanelType, showToasts, t } from 'tailchat-shared';
import { GroupPanelItem } from '@/components/GroupPanelItem';
import { GroupTextPanelItem } from './TextPanelItem';
import { Dropdown, Menu } from 'antd';
import copy from 'copy-to-clipboard';

/**
 * 群组面板侧边栏组件
 */
export const SidebarItem: React.FC<{
  groupId: string;
  panel: GroupPanel;
}> = React.memo((props) => {
  const { groupId, panel } = props;

  const menu = (
    <Menu>
      <Menu.Item
        key="copylink"
        onClick={() => {
          copy(`${location.origin}/main/group/${groupId}/${panel.id}`);
          showToasts(t('已复制到剪切板'));
        }}
      >
        {t('复制链接')}
      </Menu.Item>
    </Menu>
  );

  console.log('Dropdown', Dropdown);

  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <div>
        {panel.type === GroupPanelType.TEXT ? (
          <GroupTextPanelItem groupId={groupId} panel={panel} />
        ) : (
          <GroupPanelItem
            name={panel.name}
            icon={<div>#</div>}
            to={`/main/group/${groupId}/${panel.id}`}
          />
        )}
      </div>
    </Dropdown>
  );
});
SidebarItem.displayName = 'SidebarItem';
