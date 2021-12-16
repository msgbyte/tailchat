import { getCachedUserInfo } from '../../cache/cache';
import type { UserBaseInfo } from '../../model/user';
import { useAsync } from '../useAsync';

/**
 * 用户信息列表
 */
export function useUserInfoList(userIds: string[] = []): UserBaseInfo[] {
  const { value: userInfoList = [] } = useAsync(async () => {
    const users = await Promise.all(userIds.map((id) => getCachedUserInfo(id)));

    return users;
  }, [userIds.join(',')]);

  return userInfoList;
}
