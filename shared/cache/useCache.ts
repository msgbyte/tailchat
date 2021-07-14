import { useQuery } from 'react-query';
import {
  fetchUserInfo,
  getUserOnlineStatus,
  UserBaseInfo,
} from '../model/user';

/**
 * 用户缓存
 */
export function useCachedUserInfo(
  userId: string,
  refetch = false
): UserBaseInfo | Record<string, never> {
  const { data } = useQuery(['user', userId], () => fetchUserInfo(userId), {
    staleTime: 2 * 60 * 60 * 1000, // 缓存2小时
    refetchOnMount: refetch ? 'always' : true,
  });

  return data ?? {};
}

/**
 * 用户登录状态
 */
export function useCachedOnlineStatus(ids: string[]): boolean[] {
  const { data } = useQuery(
    ['onlineStatus', ids.join(',')],
    () => getUserOnlineStatus(ids),
    {
      staleTime: 10 * 1000, // 缓存10s
    }
  );

  return data ?? ids.map(() => false);
}
