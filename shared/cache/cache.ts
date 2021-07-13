import { fetchUserInfo, UserBaseInfo } from '../model/user';
import { queryClient } from './index';

function buildCacheFactory<T>(
  scope: string,
  fetcher: (id: string) => Promise<T>
) {
  return async (id: string): Promise<T> => {
    const data = await queryClient.fetchQuery([scope, id], () => fetcher(id));
    return data;
  };
}

/**
 * 获取缓存的用户信息
 */
export const getCachedUserInfo = buildCacheFactory<UserBaseInfo>(
  'user',
  fetchUserInfo
);
