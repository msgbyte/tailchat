import { GroupPanelItem } from '@/components/GroupPanelItem';
import React from 'react';
import {
  GroupPanel,
  useGroupTextPanelUnread,
  useUserNotifyMute,
} from 'tailchat-shared';
import { useGroupPanelExtraBadge } from './utils';

interface GroupTextPanelItemProps {
  groupId: string;
  panel: GroupPanel;
  icon: React.ReactNode;
}

/**
 * 相比一般的面板项增加了未读提示
 */
export const GroupAckPanelItem: React.FC<GroupTextPanelItemProps> = React.memo(
  (props) => {
    const { groupId, panel } = props;
    const panelId = panel.id;
    const hasUnread = useGroupTextPanelUnread(panelId);
    const extraBadge = useGroupPanelExtraBadge(groupId, panelId);
    const { checkIsMuted } = useUserNotifyMute();
    const isMuted = checkIsMuted(panelId, groupId);

    return (
      <GroupPanelItem
        name={panel.name}
        icon={props.icon}
        to={`/main/group/${groupId}/${panel.id}`}
        dimmed={isMuted}
        badge={hasUnread}
        badgeProps={{
          status: isMuted ? 'default' : 'error',
        }}
        extraBadge={extraBadge}
      />
    );
  }
);
GroupAckPanelItem.displayName = 'GroupAckPanelItem';
