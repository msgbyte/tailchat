import { useMemo } from 'react';
import { useUserInfoList } from '../..';
import type { GroupInfo, GroupPanel } from '../../model/group';
import type { UserBaseInfo } from '../../model/user';
import { isValidStr } from '../../utils/string-helper';
import { useAppSelector } from './useAppSelector';
import { useUnread } from './useUnread';
import { useUserId } from './useUserInfo';
import _compact from 'lodash/compact';

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

  return _compact(userInfos); // 开发环境，可能会出现member里面id为不存在的脏数据，生产环境原则上不会出现，兼容一下
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
 * 检查群组聊天面板是否有未读消息
 * @param textPanelId 文字面板id
 */
export function useGroupTextPanelUnread(textPanelId: string): boolean {
  const unread = useUnread([textPanelId]);

  return unread[0];
}
