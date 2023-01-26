import { Icon } from 'tailchat-design';
import { GroupUserPopover } from '@/components/popover/GroupUserPopover';
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
  useUserInfoList,
} from 'tailchat-shared';
import _compact from 'lodash/compact';
import { Problem } from '@/components/Problem';
import { useGroupMemberAction } from '@/hooks/useGroupMemberAction';

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
  const userInfoList = useUserInfoList(members.map((m) => m.userId));
  const membersOnlineStatus = useCachedOnlineStatus(
    members.map((m) => m.userId)
  );
  const [allowManageUser] = useHasGroupPermission(groupId, [
    PERMISSION.core.manageUser,
  ]);
  const { hideGroupMemberDiscriminator } = getGroupConfigWithInfo(groupInfo);

  const {
    searchText,
    setSearchText,
    isSearching,
    searchResult: filteredGroupMembers,
    getMemberHasMute,
    handleMuteMember,
    handleUnmuteMember,
    handleRemoveGroupMember,
  } = useGroupMemberAction(groupId);

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

  if (!groupInfo) {
    return <Problem />;
  }

  if (userInfoList.length === 0) {
    return <Skeleton />;
  }

  const renderUser = (member: UserBaseInfo) => {
    const hasMute = getMemberHasMute(member._id);

    if (allowManageUser) {
      const muteItems: MenuProps['items'] = hasMute
        ? [
            {
              key: 'unmute',
              label: t('解除禁言'),
              onClick: () => handleUnmuteMember(member._id),
            },
          ]
        : [
            {
              key: 'mute',
              label: t('禁言'),
              children: [
                {
                  key: '1m',
                  label: t('1分钟'),
                  onClick: () => handleMuteMember(member._id, 1 * 60 * 1000),
                },
                {
                  key: '5m',
                  label: t('5分钟'),
                  onClick: () => handleMuteMember(member._id, 5 * 60 * 1000),
                },
                {
                  key: '10m',
                  label: t('10分钟'),
                  onClick: () => handleMuteMember(member._id, 10 * 60 * 1000),
                },
                {
                  key: '30m',
                  label: t('30分钟'),
                  onClick: () => handleMuteMember(member._id, 30 * 60 * 1000),
                },
                {
                  key: '1d',
                  label: t('1天'),
                  onClick: () =>
                    handleMuteMember(member._id, 1 * 24 * 60 * 60 * 1000),
                },
                {
                  key: '7d',
                  label: t('7天'),
                  onClick: () =>
                    handleMuteMember(member._id, 7 * 24 * 60 * 60 * 1000),
                },
                {
                  key: '30d',
                  label: t('30天'),
                  onClick: () =>
                    handleMuteMember(member._id, 30 * 24 * 60 * 60 * 1000),
                },
              ],
            },
          ];

      const menu: MenuProps = {
        items: _compact([
          ...muteItems,
          {
            key: 'delete',
            label: t('移出群组'),
            danger: true,
            onClick: () => handleRemoveGroupMember(member._id),
          },
        ] as MenuProps['items']),
      };

      return (
        <Dropdown key={member._id} trigger={['contextMenu']} menu={menu}>
          <div>
            <UserListItem
              userId={member._id}
              popover={
                <GroupUserPopover userInfo={member} groupInfo={groupInfo} />
              }
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
          popover={<GroupUserPopover userInfo={member} groupInfo={groupInfo} />}
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
