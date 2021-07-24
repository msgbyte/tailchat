import { useMemo } from 'react';
import type { GroupInfo, GroupPanel } from '../../model/group';
import { useAppSelector } from './useAppSelector';

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
): GroupPanel | undefined {
  const groupInfo = useGroupInfo(groupId);

  return useMemo(
    () => groupInfo?.panels.find((p) => p.id === panelId),
    [groupInfo, panelId]
  );
}
