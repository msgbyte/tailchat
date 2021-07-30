import { ChatConverseInfo, fetchConverseInfo } from '../model/converse';
import { fetchUserInfo, UserBaseInfo } from '../model/user';
import { queryClient } from './index';

/**
 * 获取缓存的用户信息
 */
export async function getCachedUserInfo(
  userId: string,
  refetch = false
): Promise<UserBaseInfo> {
  const data = await queryClient.fetchQuery(
    ['user', userId],
    () => fetchUserInfo(userId),
    {
      staleTime: refetch ? 0 : 2 * 60 * 60 * 1000, // 缓存2小时
    }
  );
  return data;
}

/**
 * 获取缓存的会话信息
 */
export async function getCachedConverseInfo(
  converseId: string
): Promise<ChatConverseInfo> {
  const data = await queryClient.fetchQuery(['converse', converseId], () =>
    fetchConverseInfo(converseId)
  );
  return data;
}
