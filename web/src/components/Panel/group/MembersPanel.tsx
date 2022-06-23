import { Icon } from '@/components/Icon';
import { GroupUserPopover } from '@/components/popover/GroupUserPopover';
import { UserListItem } from '@/components/UserListItem';
import { Divider, Input, Skeleton } from 'antd';
import React, { useMemo } from 'react';
import {
  t,
  useCachedOnlineStatus,
  useGroupInfo,
  UserBaseInfo,
  useSearch,
} from 'tailchat-shared';
import { useUserInfoList } from 'tailchat-shared/hooks/model/useUserInfoList';

interface MembersPanelProps {
  groupId: string;
}

/**
 * 用户面板
 */
export const MembersPanel: React.FC<MembersPanelProps> = React.memo((props) => {
  const groupInfo = useGroupInfo(props.groupId);
  const members = groupInfo?.members ?? [];
  const userInfoList = useUserInfoList(members.map((m) => m.userId));
  const membersOnlineStatus = useCachedOnlineStatus(
    members.map((m) => m.userId)
  );

  const {
    searchText,
    setSearchText,
    isSearching,
    searchResult: filteredGroupMembers,
  } = useSearch({
    dataSource: userInfoList,
    filterFn: (item, searchText) => item.nickname.includes(searchText),
  });

  const groupedMembers = useMemo(() => {
    const online: UserBaseInfo[] = [];
    const offline: UserBaseInfo[] = [];

    userInfoList.forEach((m, i) => {
      if (membersOnlineStatus[i] === true) {
        online.push(m);
      } else {
        offline.push(m);
      }
    });

    return {
      online,
      offline,
    };
  }, [userInfoList, membersOnlineStatus]);

  if (userInfoList.length === 0) {
    return <Skeleton />;
  }

  const renderUser = (member: UserBaseInfo) => (
    <UserListItem
      key={member._id}
      userId={member._id}
      popover={<GroupUserPopover userInfo={member} />}
    />
  );

  return (
    <div>
      <div className="p-2">
        <Input
          placeholder={t('搜索成员')}
          size="large"
          suffix={<Icon fontSize={20} color="grey" icon="mdi:magnify" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {isSearching ? (
        filteredGroupMembers.map(renderUser)
      ) : (
        <>
          {groupedMembers.online.map(renderUser)}

          <Divider>{t('以下用户已离线')}</Divider>

          {groupedMembers.offline.map(renderUser)}
        </>
      )}
    </div>
  );
});
MembersPanel.displayName = 'MembersPanel';
