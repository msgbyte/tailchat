import { Icon } from 'tailchat-design';
import { openReconfirmModalP } from '@/components/Modal';
import { GroupUserPopover } from '@/components/popover/GroupUserPopover';
import { UserListItem } from '@/components/UserListItem';
import { Divider, Dropdown, Input, Menu, Skeleton } from 'antd';
import React, { useMemo } from 'react';
import {
  formatFullTime,
  GroupMember,
  humanizeMsDuration,
  model,
  showToasts,
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

function getMembersHasMute(members: GroupMember[], userId: string): boolean {
  const member = members.find((m) => m.userId === userId);

  if (!member || !member.muteUntil) {
    return false;
  }

  const muteUntil = member.muteUntil;

  return new Date(muteUntil).valueOf() > new Date().valueOf();
}

/**
 * 禁言相关
 */
function useMemberMuteAction(
  groupId: string,
  userInfoList: model.user.UserBaseInfo[]
) {
  /**
   * 禁言
   */
  const [, handleMuteMember] = useAsyncRequest(
    async (memberId: string, ms: number) => {
      const memberInfo = userInfoList.find((m) => m._id === memberId);

      if (!memberInfo) {
        throw new Error(t('没有找到用户'));
      }

      if (
        await openReconfirmModalP({
          title: t('确定要禁言 {{name}} 么', { name: memberInfo.nickname }),
          content: t('禁言 {{length}}, 预计到 {{until}} 为止', {
            length: humanizeMsDuration(ms),
            until: formatFullTime(new Date().valueOf() + ms),
          }),
        })
      ) {
        await model.group.muteGroupMember(groupId, memberId, ms);
        showToasts(t('操作成功'), 'success');
      }
    },
    [groupId, userInfoList]
  );

  /**
   * 解除禁言
   */
  const [, handleUnmuteMember] = useAsyncRequest(
    async (memberId: string) => {
      await model.group.muteGroupMember(groupId, memberId, -1);
      showToasts(t('操作成功'), 'success');
    },
    [groupId]
  );

  return { handleMuteMember, handleUnmuteMember };
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
  const isGroupOwner = useIsGroupOwner(groupId);

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

  const { handleMuteMember, handleUnmuteMember } = useMemberMuteAction(
    groupId,
    userInfoList
  );

  if (userInfoList.length === 0) {
    return <Skeleton />;
  }

  const renderUser = (member: UserBaseInfo) => {
    const hasMute = getMembersHasMute(members, member._id);

    if (isGroupOwner) {
      return (
        <Dropdown
          key={member._id}
          trigger={['contextMenu']}
          overlay={
            <Menu>
              {hasMute ? (
                <Menu.Item onClick={() => handleUnmuteMember(member._id)}>
                  {t('解除禁言')}
                </Menu.Item>
              ) : (
                <Menu.SubMenu title={t('禁言')}>
                  <Menu.Item
                    onClick={() => handleMuteMember(member._id, 1 * 60 * 1000)}
                  >
                    {t('1分钟')}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => handleMuteMember(member._id, 5 * 60 * 1000)}
                  >
                    {t('5分钟')}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => handleMuteMember(member._id, 10 * 60 * 1000)}
                  >
                    {t('10分钟')}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => handleMuteMember(member._id, 30 * 60 * 1000)}
                  >
                    {t('30分钟')}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      handleMuteMember(member._id, 1 * 24 * 60 * 60 * 1000)
                    }
                  >
                    {t('1天')}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      handleMuteMember(member._id, 7 * 24 * 60 * 60 * 1000)
                    }
                  >
                    {t('7天')}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      handleMuteMember(member._id, 30 * 24 * 60 * 60 * 1000)
                    }
                  >
                    {t('30天')}
                  </Menu.Item>
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
