import { Icon } from 'tailchat-design';
import { UserListItem } from '@/components/UserListItem';
import { Dropdown, Input, MenuProps, Skeleton } from 'antd';
import React, { useMemo } from 'react';
import {
  getGroupConfigWithInfo,
  PERMISSION,
  t,
  useCachedOnlineStatus,
  useGroupInfo,
  useHasGroupPermission,
  UserBaseInfo,
} from 'tailchat-shared';
import { Problem } from '@/components/Problem';
import { useGroupMemberAction } from '@/hooks/useGroupMemberAction';
import { UserPopover } from '@/components/popover/UserPopover';
import { GroupedVirtuoso } from 'react-virtuoso';
import _take from 'lodash/take';
import _sum from 'lodash/sum';
import _get from 'lodash/get';

interface MembersPanelProps {
  groupId: string;
}

/**
 * 用户面板
 */
export const MembersPanel: React.FC<MembersPanelProps> = React.memo((props) => {
  const groupId = props.groupId;
  const groupInfo = useGroupInfo(groupId);
  const members = groupInfo?.members ?? [];
  const membersOnlineStatus = useCachedOnlineStatus(
    members.map((m) => m.userId)
  );
  const [allowManageUser] = useHasGroupPermission(groupId, [
    PERMISSION.core.manageUser,
  ]);
  const { hideGroupMemberDiscriminator } = getGroupConfigWithInfo(groupInfo);

  const {
    userInfos,
    searchText,
    setSearchText,
    isSearching,
    searchResult: filteredGroupMembers,
    generateActionMenu,
  } = useGroupMemberAction(groupId);

  const sortedMembers = useMemo(() => {
    const online: UserBaseInfo[] = [];
    const offline: UserBaseInfo[] = [];

    userInfos.forEach((m, i) => {
      if (membersOnlineStatus[i] === true) {
        online.push(m);
      } else {
        offline.push(m);
      }
    });

    return {
      [t('在线')]: online,
      [t('离线')]: offline,
    };
  }, [userInfos, membersOnlineStatus]);

  const { groupCounts, groupNames, getGroupedMemberInfo } = useMemo(() => {
    const groupMemberInfo = isSearching
      ? { '': filteredGroupMembers }
      : sortedMembers;

    const groupCounts = Object.values(groupMemberInfo).map(
      (item) => item.length
    );
    const groupNames = Object.keys(groupMemberInfo);

    const getGroupedMemberInfo = (
      index: number,
      groupIndex: number
    ): UserBaseInfo | null => {
      const groupName = groupNames[groupIndex];
      const prevIndexCount = _sum(_take(groupCounts, groupIndex));
      const currentGroupIndex = index - prevIndexCount;

      return _get(groupMemberInfo, [groupName, currentGroupIndex], null);
    };

    return { groupCounts, groupNames, getGroupedMemberInfo };
  }, [isSearching, filteredGroupMembers, sortedMembers]);

  if (!groupInfo) {
    return <Problem />;
  }

  if (userInfos.length === 0) {
    return <Skeleton />;
  }

  const renderUser = (member: UserBaseInfo | null) => {
    if (!member) {
      return <div />;
    }

    if (allowManageUser) {
      const menu: MenuProps = generateActionMenu(member);

      return (
        <Dropdown key={member._id} trigger={['contextMenu']} menu={menu}>
          <div>
            <UserListItem
              userId={member._id}
              popover={<UserPopover userInfo={member} />}
              hideDiscriminator={hideGroupMemberDiscriminator}
            />
          </div>
        </Dropdown>
      );
    } else {
      return (
        <UserListItem
          key={member._id}
          userId={member._id}
          popover={<UserPopover userInfo={member} />}
          hideDiscriminator={hideGroupMemberDiscriminator}
        />
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-2">
        <Input
          placeholder={t('搜索成员')}
          size="large"
          suffix={<Icon fontSize={20} color="grey" icon="mdi:magnify" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="flex-1">
        <GroupedVirtuoso
          className="h-full"
          groupCounts={groupCounts}
          groupContent={(index) => {
            return (
              <div className="pt-4 px-2.5 font-bold text-sm text-opacity-80 bg-content-light dark:bg-content-dark">
                {groupNames[index]} - {groupCounts[index]}
              </div>
            );
          }}
          itemContent={(i, groupIndex) =>
            renderUser(getGroupedMemberInfo(i, groupIndex))
          }
        />
      </div>
    </div>
  );
});
MembersPanel.displayName = 'MembersPanel';
