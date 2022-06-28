import { model, t } from 'tailchat-shared';

/**
 * 所有人权限
 * 群组最低权限标识
 */
export const AllPermission = Symbol('AllPermission');

export const permissionList = [
  {
    key: 'core.message',
    title: t('发送消息'),
    desc: t('允许成员在文字频道发送消息'),
    default: true,
  },
];

export function getDefaultPermissionList(): string[] {
  return permissionList.filter((p) => p.default).map((p) => p.key);
}

/**
 * 初始化默认所有人身份组权限
 */
export async function applyDefaultFallbackGroupPermission(groupId: string) {
  await model.group.modifyGroupField(
    groupId,
    'fallbackPermissions',
    getDefaultPermissionList()
  );
}
