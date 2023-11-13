import { openReconfirmModalP } from '@/components/Modal';
import type { MenuProps } from 'antd';
import {
  formatFullTime,
  humanizeMsDuration,
  model,
  PERMISSION,
  showSuccessToasts,
  t,
  useAsyncRequest,
  useEvent,
  useGroupInfo,
  useGroupMemberInfos,
  useHasGroupPermission,
  UserBaseInfo,
  useUserSearch,
} from 'tailchat-shared';
import _compact from 'lodash/compact';

/**
 * 群组成员管理相关操作
 */
export function useGroupMemberAction(groupId: string) {
  const groupInfo = useGroupInfo(groupId);
  const members = groupInfo?.members ?? [];
  const roles = groupInfo?.roles ?? [];
  const userInfos = useGroupMemberInfos(groupId);
  const [allowManageUser, allowManageRoles] = useHasGroupPermission(groupId, [
    PERMISSION.core.manageUser,
    PERMISSION.core.manageRoles,
  ]);

  const { handleMuteMember, handleUnmuteMember } = useMemberMuteAction(
    groupId,
    userInfos
  );

  const { searchText, setSearchText, isSearching, searchResult } =
    useUserSearch(userInfos);

  /**
   * 移除用户
   */
  const [, handleRemoveGroupMember] = useAsyncRequest(
    async (memberId: string) => {
      const confirm = await openReconfirmModalP({
        title: t('确认要将该用户移出群组么'),
      });
      if (confirm) {
        await model.group.deleteGroupMember(groupId, memberId);
        showSuccessToasts();
      }
    },
    [groupId]
  );

  const getMemberHasMute = useEvent((userId: string): boolean => {
    const member = members.find((m) => m.userId === userId);

    if (!member || !member.muteUntil) {
      return false;
    }

    const muteUntil = member.muteUntil;

    return new Date(muteUntil).valueOf() > new Date().valueOf();
  });

  const getMemberRoles = useEvent((userId: string): string[] => {
    return members.find((m) => m.userId === userId)?.roles ?? [];
  });

  /**
   * 生成群组成员操作菜单
   */
  const generateActionMenu = useEvent((member: UserBaseInfo): MenuProps => {
    const hasMute = getMemberHasMute(member._id);
    const memberRoles = getMemberRoles(member._id);

    const muteItems: MenuProps['items'] = allowManageUser
      ? hasMute
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
          ]
      : [];

    const roleItems: MenuProps['items'] =
      allowManageRoles && roles.length > 0
        ? [
            {
              key: 'manageRole',
              label: t('分配身份组'),
              children: roles.map((role) => ({
                key: role._id,
                label: role.name,
                className: memberRoles.includes(role._id)
                  ? 'underline'
                  : undefined,
                onClick: async () => {
                  // switch member role
                  if (memberRoles.includes(role._id)) {
                    // 已拥有该身份
                    await model.group.removeGroupMemberRoles(
                      groupId,
                      [member._id],
                      [role._id]
                    );
                    showSuccessToasts(
                      t('移除用户 [{{name}}] 身份组 [{{roleName}}] 成功', {
                        name: member.nickname,
                        roleName: role.name,
                      })
                    );
                  } else {
                    // 没有该身份
                    await model.group.appendGroupMemberRoles(
                      groupId,
                      [member._id],
                      [role._id]
                    );
                    showSuccessToasts(
                      t('授予用户 [{{name}}] 身份组 [{{roleName}}] 成功', {
                        name: member.nickname,
                        roleName: role.name,
                      })
                    );
                  }
                },
              })),
            },
          ]
        : [];

    const menu: MenuProps = {
      items: _compact([
        ...muteItems,
        ...roleItems,
        allowManageUser && {
          key: 'delete',
          label: t('移出群组'),
          danger: true,
          onClick: () => handleRemoveGroupMember(member._id),
        },
      ] as MenuProps['items']),
    };

    return menu;
  });

  return {
    userInfos,

    // 搜索相关
    searchText,
    setSearchText,
    isSearching,
    searchResult,

    getMemberHasMute,

    // 用户操作
    handleMuteMember,
    handleUnmuteMember,
    handleRemoveGroupMember,

    generateActionMenu,
  };
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
        showSuccessToasts();
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
      showSuccessToasts();
    },
    [groupId]
  );

  return { handleMuteMember, handleUnmuteMember };
}
