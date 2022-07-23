import { useAppSelector } from './useAppSelector';

/**
 * 获取用户禁言状态
 * @param groupId 群组ID
 * @param userId 用户ID
 * @returns 如果没有禁言状态或者有禁言但是已过期则返回false，否则返回禁言到的时间
 */
export function useGroupMemberMute(
  groupId: string,
  userId: string
): string | false {
  const muteUntil = useAppSelector(
    (state) =>
      state.group.groups[groupId]?.members.find((m) => m.userId === userId)
        ?.muteUntil
  );

  if (!muteUntil || new Date(muteUntil).valueOf() < new Date().valueOf()) {
    return false;
  }

  return muteUntil;
}
