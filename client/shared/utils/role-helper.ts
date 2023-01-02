import { model, t } from '..';

/**
 * 所有人权限
 * 群组最低权限标识
 */
export const AllPermission = Symbol('AllPermission');

export interface PermissionItemType {
  /**
   * 权限唯一key, 用于写入数据库
   * 如果为插件则权限点应当符合命名规范, 如: plugin.com.msgbyte.github.manage
   */
  key: string;
  /**
   * 权限点显示名称
   */
  title: string;
  /**
   * 权限描述
   */
  desc: string;
  /**
   * 是否默认开启
   */
  default: boolean;
  /**
   * 是否依赖其他权限点
   */
  required?: string[];
}

export const PERMISSION = {
  /**
   * 非插件的权限点都叫core
   */
  core: {
    message: 'core.message',
    invite: 'core.invite',
    unlimitedInvite: 'core.unlimitedInvite',
    groupDetail: 'core.groupDetail',
    manageUser: 'core.manageUser',
    managePanel: 'core.managePanel',
    manageInvite: 'core.manageInvite',
    manageRoles: 'core.manageRoles',
  },
};

export const getPermissionList = (): PermissionItemType[] => [
  {
    key: PERMISSION.core.message,
    title: t('发送消息'),
    desc: t('允许成员在文字频道发送消息'),
    default: true,
  },
  {
    key: PERMISSION.core.invite,
    title: t('邀请链接'),
    desc: t('允许成员创建邀请链接'),
    default: false,
  },
  {
    key: PERMISSION.core.unlimitedInvite,
    title: t('不限时邀请链接'),
    desc: t('允许成员创建不限时邀请链接'),
    default: false,
    required: [PERMISSION.core.invite],
  },
  {
    key: PERMISSION.core.groupDetail,
    title: t('查看群组详情'),
    desc: t('允许成员查看群组详情'),
    default: false,
  },
  {
    key: PERMISSION.core.manageUser,
    title: t('允许管理用户'),
    desc: t('允许成员管理用户，如禁言、移除用户等操作'),
    default: false,
    required: [PERMISSION.core.groupDetail],
  },
  {
    key: PERMISSION.core.managePanel,
    title: t('允许管理频道'),
    desc: t('允许成员查看管理频道'),
    default: false,
    required: [PERMISSION.core.groupDetail],
  },
  {
    key: PERMISSION.core.manageInvite,
    title: t('允许管理邀请链接'),
    desc: t('允许成员管理邀请链接'),
    default: false,
    required: [PERMISSION.core.groupDetail],
  },
  {
    key: PERMISSION.core.manageRoles,
    title: t('允许管理身份组'),
    desc: t('允许成员管理身份组'),
    default: false,
    required: [PERMISSION.core.groupDetail],
  },
];

/**
 * 获取默认权限列表
 */
export function getDefaultPermissionList(): string[] {
  return getPermissionList()
    .filter((p) => p.default)
    .map((p) => p.key);
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
