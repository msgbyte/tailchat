import {
  ChatConverseState,
  useCachedUserInfo,
  useUserId,
} from 'pawchat-shared';
import { isValidStr } from 'pawchat-shared/utils/string-helper';
import React, { useMemo } from 'react';
import { SidebarItem } from '../SidebarItem';

interface SidebarDMItemProps {
  converse: ChatConverseState;
}
export const SidebarDMItem: React.FC<SidebarDMItemProps> = React.memo(
  (props) => {
    const converse = props.converse;
    const userId = useUserId();
    const otherMemberId = converse.members.find((m) => m !== userId);
    const memberInfo = useCachedUserInfo(otherMemberId ?? null);
    const memberSize = converse.members.length;

    const name = useMemo(() => {
      if (isValidStr(converse.name)) {
        return converse.name;
      }

      let name = memberInfo.nickname;
      if (memberSize >= 3) {
        name += ' 等人的会话';
      }

      return name;
    }, [converse.name, memberInfo.nickname, memberSize]);

    return (
      <SidebarItem
        key={converse._id}
        name={name}
        // TODO
        // action={<Icon icon="mdi-close" />}
        to={`/main/personal/converse/${converse._id}`}
      />
    );
  }
);
SidebarDMItem.displayName = 'SidebarDMItem';
