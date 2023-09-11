import { useGroupInfo } from './useGroup';
import { useUserId } from './useUserInfo';
import _uniq from 'lodash/uniq';
import _flatten from 'lodash/flatten';
import { useDebugValue, useMemo } from 'react';
import { getPermissionList } from '../..';

/**
 * 获取群组用户的所有权限
 */
export function useGroupMemberAllPermissions(groupId: string): string[] {
  const groupInfo = useGroupInfo(groupId);
  const userId = useUserId();

  if (!groupInfo || !userId) {
    return [];
  }

  if (groupInfo.owner === userId) {
    // 群组管理员拥有一切权限
    // 返回所有权限
    return getPermissionList().map((p) => p.key);
  }

  const members = groupInfo.members;

  const groupRoles = groupInfo.roles;
  const userRoles = members.find((m) => m.userId === userId)?.roles ?? [];
  const userPermissions = _uniq([
    ..._flatten(
      userRoles.map(
        (roleId) =>
          groupRoles.find((role) => String(role._id) === roleId)?.permissions ??
          []
      )
    ),
    ...groupInfo.fallbackPermissions,
  ]);

  useDebugValue({
    groupRoles,
    userRoles,
    userPermissions,
    fallbackPermissions: groupInfo.fallbackPermissions,
  });

  return userPermissions;
}

/**
 * 获取面板的所有权限
 * 不包含群组本身的权限
 */
export function useGroupPanelMemberAllPermissions(
  groupId: string,
  panelId: string
): string[] {
  const groupInfo = useGroupInfo(groupId);
  const userId = useUserId();

  if (!groupInfo || !userId) {
    return [];
  }

  const panelInfo = groupInfo.panels.find((p) => p.id === panelId);
  if (!panelInfo) {
    return [];
  }

  const fallbackPermissions = panelInfo.fallbackPermissions ?? [];
  const permissionMap = panelInfo.permissionMap ?? {};
  const specPermissions = permissionMap[userId] ?? [];

  const userRoles =
    groupInfo.members.find((m) => m.userId === userId)?.roles ?? []; // 当前用户角色
  const userPanelPermissions = _uniq([
    ..._flatten(userRoles.map((roleId) => permissionMap[roleId] ?? [])),
    ...specPermissions,
    ...fallbackPermissions,
  ]);

  return userPanelPermissions;
}

/**
 * 判断用户是否拥有以下权限
 */
export function useHasGroupPermission(
  groupId: string,
  permissions: string[]
): boolean[] {
  const userPermissions = useGroupMemberAllPermissions(groupId);

  const result = useMemo(
    () => permissions.map((p) => userPermissions.includes(p)),
    [userPermissions.join(','), permissions.join(',')]
  );

  useDebugValue({
    groupId,
    userPermissions,
    checkedPermissions: permissions,
    result,
  });

  return result;
}

/**
 * 判断用户是否在某个面板下拥有以下权限
 * 用于面板权限控制
 */
export function useHasGroupPanelPermission(
  groupId: string,
  panelId: string,
  permissions: string[]
) {
  const groupPermissions = useGroupMemberAllPermissions(groupId);
  const panelPermissions = useGroupPanelMemberAllPermissions(groupId, panelId);

  const fullPermissions = _uniq([...groupPermissions, ...panelPermissions]);

  const result = useMemo(
    () => permissions.map((p) => fullPermissions.includes(p)),
    [fullPermissions.join(','), permissions.join(',')]
  );

  useDebugValue({
    groupId,
    panelId,
    fullPermissions,
    checkedPermissions: permissions,
    result,
  });

  return result;
}
