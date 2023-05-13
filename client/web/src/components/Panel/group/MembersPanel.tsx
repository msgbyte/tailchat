import { Icon } from 'tailchat-design';
import { GroupUserPopover } from '@/components/popover/UserPopover/GroupUserPopover';
import { UserListItem } from '@/components/UserListItem';
import { Divider, Dropdown, Input, MenuProps, Skeleton } from 'antd';
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

  const groupedMembers = useMemo(() => {
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
      online,
      offline,
    };
  }, [userInfos, membersOnlineStatus]);

  if (!groupInfo) {
    return <Problem />;
  }

  if (userInfos.length === 0) {
    return <Skeleton />;
  }

  const renderUser = (member: UserBaseInfo) => {
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

          {groupedMembers.offline.length > 0 && (
            <>
              <Divider>{t('以下用户已离线')}</Divider>

              {groupedMembers.offline.map(renderUser)}
            </>
          )}
        </>
      )}
    </div>
  );
});
MembersPanel.displayName = 'MembersPanel';
