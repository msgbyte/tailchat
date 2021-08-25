import { useMemo } from 'react';
import type { GroupInfo, GroupPanel } from '../../model/group';
import { isValidStr } from '../../utils/string-helper';
import { useAppSelector } from './useAppSelector';
import { useUserId } from './useUserInfo';

/**
 * 获取群组信息
 */
export function useGroupInfo(groupId: string): GroupInfo | undefined {
  return useAppSelector((state) => state.group.groups[groupId]);
}

/**
 * 获取群组面板信息
 */
export function useGroupPanel(
  groupId: string,
  panelId: string
): GroupPanel | null {
  const groupInfo = useGroupInfo(groupId);

  return useMemo(
    () => groupInfo?.panels.find((p) => p.id === panelId) ?? null,
    [groupInfo, panelId]
  );
}

/**
 * 检查是否为群组的所有者
 * @param userId 群组id 必填
 * @param userId 用户id 不传则为当前用户id
 */
export function useIsGroupOwner(groupId: string, userId?: string): boolean {
  const groupInfo = useGroupInfo(groupId);
  const selfUserId = useUserId();

  if (isValidStr(userId)) {
    return groupInfo?.owner === userId;
  } else {
    return typeof selfUserId === 'string' && groupInfo?.owner === selfUserId;
  }
}
