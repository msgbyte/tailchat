import { useMemo } from 'react';
import { GroupInfo, GroupPanel, GroupPanelType } from '../../model/group';
import type { UserBaseInfo } from '../../model/user';
import { isValidStr } from '../../utils/string-helper';
import { useAppSelector } from './useAppSelector';
import { useUnread } from './useUnread';
import { useUserId, useUserInfoList } from './useUserInfo';

/**
 * 获取群组信息
 */
export function useGroupInfo(groupId: string): GroupInfo | null {
  return useAppSelector((state) => state.group.groups[groupId]) ?? null;
}

/**
 * 获取群组中所有成员的uuid列表
 */
export function useGroupMemberIds(groupId: string): string[] {
  const groupInfo = useGroupInfo(groupId);
  const members = groupInfo?.members ?? [];
  const groupMemberIds = useMemo(() => members.map((m) => m.userId), [members]);

  return groupMemberIds;
}

/**
 * 获取群组中成员信息的详细列表
 */
export function useGroupMemberInfos(groupId: string): UserBaseInfo[] {
  const groupMemberIds = useGroupMemberIds(groupId);
  const userInfos = useUserInfoList(groupMemberIds);

  return userInfos;
}

/**
 * 获取群组面板列表
 */
export function useGroupPanels(groupId: string): GroupPanel[] {
  const groupInfo = useGroupInfo(groupId);

  return useMemo(() => groupInfo?.panels ?? [], [groupInfo]);
}

/**
 * 获取群组面板信息
 */
export function useGroupPanelInfo(
  groupId: string,
  panelId: string
): GroupPanel | null {
  const panels = useGroupPanels(groupId);

  return useMemo(
    () => panels.find((p) => p.id === panelId) ?? null,
    [groupId, panelId, panels]
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
