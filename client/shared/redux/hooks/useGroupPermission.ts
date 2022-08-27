import { useGroupInfo } from './useGroup';
import { useUserId } from './useUserInfo';
import _uniq from 'lodash/uniq';
import _flatten from 'lodash/flatten';
import { useDebugValue, useMemo } from 'react';
import { permissionList } from '../..';

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
    return permissionList.map((p) => p.key);
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
