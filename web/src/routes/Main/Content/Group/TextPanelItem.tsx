import { GroupPanelItem } from '@/components/GroupPanelItem';
import React from 'react';
import { GroupPanel, useGroupTextPanelUnread } from 'tailchat-shared';

interface GroupTextPanelItemProps {
  groupId: string;
  panel: GroupPanel;
  icon: React.ReactNode;
}

/**
 * 相比一般的面板项增加了未读提示
 */
export const GroupTextPanelItem: React.FC<GroupTextPanelItemProps> = React.memo(
  (props) => {
    const { groupId, panel } = props;
    const panelId = panel.id;
    const hasUnread = useGroupTextPanelUnread(panelId);

    return (
      <GroupPanelItem
        name={panel.name}
        icon={props.icon}
        to={`/main/group/${groupId}/${panel.id}`}
        badge={hasUnread}
      />
    );
  }
);
GroupTextPanelItem.displayName = 'GroupTextPanelItem';
