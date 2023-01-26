import { openReconfirmModalP } from '@/components/Modal';
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
  useSearch,
} from 'tailchat-shared';

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

  return {
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
