import { Icon } from '@/components/Icon';
import { GroupUserPopover } from '@/components/popover/GroupUserPopover';
import { UserListItem } from '@/components/UserListItem';
import { Divider, Dropdown, Input, Menu, Skeleton } from 'antd';
import React, { useMemo } from 'react';
import {
  GroupMember,
  isDevelopment,
  t,
  useAsyncRequest,
  useCachedOnlineStatus,
  useGroupInfo,
  useIsGroupOwner,
  UserBaseInfo,
  useSearch,
} from 'tailchat-shared';
import { useUserInfoList } from 'tailchat-shared/hooks/model/useUserInfoList';

interface MembersPanelProps {
  groupId: string;
}

function getMembersMuteUntil(
  members: GroupMember[],
  userId: string
): string | undefined {
  const member = members.find((m) => m.userId === userId);

  if (!member) {
    return undefined;
  }

  return member.muteUntil;
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
  const isGroupOwner = useIsGroupOwner(props.groupId);

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

  const renderUser = (member: UserBaseInfo) => {
    const muteUntil = getMembersMuteUntil(members, member._id);

    if (isGroupOwner && isDevelopment) {
      return (
        <Dropdown
          key={member._id}
          trigger={['contextMenu']}
          overlay={
            <Menu>
              {muteUntil ? (
                <Menu.Item>{t('解除禁言')}</Menu.Item>
              ) : (
                <Menu.SubMenu title={t('禁言')}>
                  <Menu.Item>{t('1分钟')}</Menu.Item>
                  <Menu.Item>{t('5分钟')}</Menu.Item>
                  <Menu.Item>{t('10分钟')}</Menu.Item>
                  <Menu.Item>{t('30分钟')}</Menu.Item>
                  <Menu.Item>{t('1天')}</Menu.Item>
                  <Menu.Item>{t('7天')}</Menu.Item>
                  <Menu.Item>{t('30天')}</Menu.Item>
                </Menu.SubMenu>
              )}
            </Menu>
          }
        >
          <div>
            <UserListItem
              userId={member._id}
              popover={<GroupUserPopover userInfo={member} />}
            />
          </div>
        </Dropdown>
      );
    } else {
      return (
        <UserListItem
          key={member._id}
          userId={member._id}
          popover={<GroupUserPopover userInfo={member} />}
        />
      );
    }
  };

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
