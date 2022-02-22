import { getCachedUserInfo } from '../../cache/cache';
import { useAsync } from '../../hooks/useAsync';
import type { UserLoginInfo } from '../../model/user';
import { useAppSelector } from './useAppSelector';

/**
 * 获取当前用户基本信息
 */
export function useUserInfo(): UserLoginInfo | null {
  return useAppSelector((state) => state.user.info);
}

/**
 * 用户基本Id
 */
export function useUserId(): string | undefined {
  return useUserInfo()?._id;
}

/**
 * 根据用户id获取用户信息列表
 */
export function useUserInfoList(userIds: string[]) {
  const { value: userInfos = [] } = useAsync(() => {
    return Promise.all(userIds.map((userId) => getCachedUserInfo(userId)));
  }, [userIds.join(',')]);

  return userInfos;
}
