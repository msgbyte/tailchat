import { useMemo } from 'react';
import { GroupInfo, GroupPanel, GroupPanelType } from '../../model/group';
import { isValidStr } from '../../utils/string-helper';
import { useAppSelector } from './useAppSelector';
import { useUnread } from './useUnread';
import { useUserId } from './useUserInfo';

/**
 * 获取群组信息
 */
export function useGroupInfo(groupId: string): GroupInfo | null {
  return useAppSelector((state) => state.group.groups[groupId]) ?? null;
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

/**
 * 检查群组是否有未读消息
 * @param groupId 群组id
 */
export function useGroupUnread(groupId: string): boolean {
  const group = useGroupInfo(groupId);
  const groupTextPanelIds = (group?.panels ?? [])
    .filter((panel) => panel.type === GroupPanelType.TEXT)
    .map((p) => p.id);

  const unread = useUnread(groupTextPanelIds);

  return unread.some((u) => u === true);
}

/**
 * 检查群组聊天面板是否有未读消息
 * @param textPanelId 文字面板id
 */
export function useGroupTextPanelUnread(textPanelId: string): boolean {
  const unread = useUnread([textPanelId]);

  return unread[0];
}
