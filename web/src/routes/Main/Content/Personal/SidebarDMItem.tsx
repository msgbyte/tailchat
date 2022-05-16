import {
  ChatConverseState,
  getCachedUserInfo,
  useAsync,
  useDMConverseName,
  useUnread,
  useUserId,
} from 'tailchat-shared';
import React from 'react';
import { SidebarItem } from '../SidebarItem';
import { CombinedAvatar } from 'tailchat-design';
import _without from 'lodash/without';

interface SidebarDMItemProps {
  converse: ChatConverseState;
}
export const SidebarDMItem: React.FC<SidebarDMItemProps> = React.memo(
  (props) => {
    const converse = props.converse;
    const name = useDMConverseName(converse);
    const userId = useUserId();
    const [hasUnread] = useUnread([converse._id]);

    const { value: icon } = useAsync(async () => {
      if (!userId) {
        return;
      }

      const userInfos = await Promise.all(
        _without<string>(converse.members, userId).map((memberUserId) =>
          getCachedUserInfo(memberUserId)
        )
      );

      return (
        <CombinedAvatar
          items={userInfos.map((user) => ({
            name: user.nickname,
            src: user.avatar,
          }))}
        />
      );
    }, [converse.members, userId]);

    return (
      <SidebarItem
        key={converse._id}
        name={name}
        // action={<Icon icon="mdi:close" />} // TODO
        icon={icon}
        to={`/main/personal/converse/${converse._id}`}
        badge={hasUnread}
      />
    );
  }
);
SidebarDMItem.displayName = 'SidebarDMItem';
