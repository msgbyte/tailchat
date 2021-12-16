import { useUserInfoList } from './useUserInfoList';

/**
 * 用户名列表
 */
export function useUsernames(userIds: string[]): string[] {
  const userInfoList = useUserInfoList(userIds);

  return userInfoList.map((info) => info.nickname);
}
