import { getCachedUserInfo } from '../../cache/cache';
import type { UserBaseInfo } from '../../model/user';
import { useAsync } from '../useAsync';

/**
 * 用户信息
 */
export function useCachedUserInfo(
  userId: string,
  refetch = false
): UserBaseInfo | Record<string, never> {
  const { value: userInfo = {} } = useAsync(async () => {
    const users = getCachedUserInfo(userId, refetch);

    return users;
  }, [userId, refetch]);

  return userInfo ?? {};
}
