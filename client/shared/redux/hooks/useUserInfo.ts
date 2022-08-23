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
