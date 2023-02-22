import { useGroupIdContext } from '@/context/GroupIdContext';
import React from 'react';
import { useGroupInfo, UserBaseInfo } from 'tailchat-shared';
import { GroupUserPopover } from './GroupUserPopover';
import { PersonalUserPopover } from './PersonalUserPopover';

/**
 * Common Entry for User Popover
 */
export const UserPopover: React.FC<{
  userInfo: UserBaseInfo;
}> = React.memo((props) => {
  const groupId = useGroupIdContext();
  const groupInfo = useGroupInfo(groupId);

  if (groupInfo) {
    return <GroupUserPopover userInfo={props.userInfo} groupInfo={groupInfo} />;
  }

  // TODO
  return <PersonalUserPopover userInfo={props.userInfo} />;
});
UserPopover.displayName = 'UserPopover';
