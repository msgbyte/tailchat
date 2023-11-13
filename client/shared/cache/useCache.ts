import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserOnlineStatus } from '../model/user';

export { useQuery, useQueryClient };

/**
 * 用户登录状态
 */
export function useCachedOnlineStatus(
  ids: string[],
  onOnlineStatusUpdate?: (onlineStatus: boolean[]) => void
): boolean[] {
  const staleTime = 20 * 1000; // 缓存20s

  const { data, isSuccess } = useQuery(
    ['onlineStatus', ids.join(',')],
    () => getUserOnlineStatus(ids),
    {
      staleTime,
    }
  );

  if (isSuccess && Array.isArray(data)) {
    if (typeof onOnlineStatusUpdate === 'function' && data) {
      onOnlineStatusUpdate(data);
    }
  }

  return data ?? ids.map(() => false);
}
