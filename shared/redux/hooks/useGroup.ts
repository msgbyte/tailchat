import type { GroupInfo } from '../../model/group';
import { useAppSelector } from './useAppSelector';

/**
 * 获取群组信息
 */
export function useGroupInfo(groupId: string): GroupInfo | undefined {
  return useAppSelector((state) => state.group.groups[groupId]);
}
