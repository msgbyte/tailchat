import { ChatConverseState, useDMConverseName } from 'tailchat-shared';
import React from 'react';
import { SidebarItem } from '../SidebarItem';
import { useUnread } from 'tailchat-shared/redux/hooks/useUnread';

interface SidebarDMItemProps {
  converse: ChatConverseState;
}
export const SidebarDMItem: React.FC<SidebarDMItemProps> = React.memo(
  (props) => {
    const converse = props.converse;
    const name = useDMConverseName(converse);
    const [hasUnread] = useUnread([converse._id]);

    return (
      <SidebarItem
        key={converse._id}
        name={name}
        // TODO
        // action={<Icon icon="mdi:close" />}
        to={`/main/personal/converse/${converse._id}`}
        badge={hasUnread}
      />
    );
  }
);
SidebarDMItem.displayName = 'SidebarDMItem';
