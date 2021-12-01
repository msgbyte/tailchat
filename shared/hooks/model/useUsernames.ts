import { getCachedUserInfo } from '../../cache/cache';
import { useAsync } from '../useAsync';

/**
 * 用户名列表
 */
export function useUsernames(userIds: string[]): string[] {
  const { value: names = [] } = useAsync(async () => {
    const users = await Promise.all(userIds.map((id) => getCachedUserInfo(id)));

    return users.map((user) => user.nickname);
  }, [userIds.join(',')]);

  return names;
}
