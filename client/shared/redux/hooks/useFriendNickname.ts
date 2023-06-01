import { useMemo } from 'react';
import { buildFriendNicknameMap } from '../../helper/converse-helper';
import { isValidStr } from '../../utils/string-helper';
import { useAppSelector } from './useAppSelector';

/**
 * 获取好友自定义的昵称
 * 用于覆盖原始昵称
 *
 * @param userId 用户id
 */
export function useFriendNickname(userId: string): string | null {
  const nickname = useAppSelector(
    (state) => state.user.friends.find((f) => f.id === userId)?.nickname
  );

  if (isValidStr(nickname)) {
    return nickname;
  }

  return null;
}

export function useFriendNicknameMap(): Record<string, string> {
  const friends = useAppSelector((state) => state.user.friends);

  const friendNicknameMap = useMemo(
    () => buildFriendNicknameMap(friends),
    [friends]
  );

  return friendNicknameMap;
}
