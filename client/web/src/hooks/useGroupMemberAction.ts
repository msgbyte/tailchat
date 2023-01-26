import { openReconfirmModalP } from '@/components/Modal';
import type { MenuProps } from 'antd';
import { useCallback } from 'react';
import {
  formatFullTime,
  humanizeMsDuration,
  model,
  showSuccessToasts,
  t,
  useAsyncRequest,
  useGroupInfo,
  useGroupMemberInfos,
  useMemoizedFn,
  UserBaseInfo,
  useSearch,
} from 'tailchat-shared';
import _compact from 'lodash/compact';

/**
 * 群组成员管理相关操作
 */
export function useGroupMemberAction(groupId: string) {
  const groupInfo = useGroupInfo(groupId);
  const members = groupInfo?.members ?? [];
  const userInfos = useGroupMemberInfos(groupId);

  const { handleMuteMember, handleUnmuteMember } = useMemberMuteAction(
    groupId,
    userInfos
  );

  const { searchText, setSearchText, isSearching, searchResult } = useSearch({
    dataSource: userInfos,
    filterFn: (item, searchText) => item.nickname.includes(searchText),
  });

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

  const getMemberHasMute = useCallback(
    (userId: string): boolean => {
      const member = members.find((m) => m.userId === userId);

      if (!member || !member.muteUntil) {
        return false;
      }

      const muteUntil = member.muteUntil;

      return new Date(muteUntil).valueOf() > new Date().valueOf();
    },
    [members]
  );

  const generateActionMenu = useMemoizedFn(
    (member: UserBaseInfo): MenuProps => {
      const hasMute = getMemberHasMute(member._id);

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

      return menu;
    }
  );

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
