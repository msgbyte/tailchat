import { useAppSelector } from './useAppSelector';

/**
 * 用户基本Id
 */
export function useUserId(): string | undefined {
  return useAppSelector((state) => state.user.info?._id);
}
