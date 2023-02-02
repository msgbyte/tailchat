import { request } from '../api/request';

export enum GroupPanelType {
  TEXT = 0,
  GROUP = 1,
  PLUGIN = 2,
}

export const groupConfigNames = [
  // 隐藏群组成员标识位
  'hideGroupMemberDiscriminator',
] as const;

export type GroupConfigNames = typeof groupConfigNames[number];

export interface GroupMember {
  roles: string[]; // 角色组
  userId: string;
  /**
   * 日期字符串 禁言到xxx
   */
  muteUntil?: string;
}

/**
 * 群组面板特性
 */
export type GroupPanelFeature =
  | 'subscribe' // 订阅事件变更状态，用于加入socket.io群组
  | 'ack'; // 是否包含已读未读检查，如果包含的话需要同时开启 subscribe 特性

export interface GroupPanel {
  /**
   * 在群组中唯一
   */
  id: string;
  /**
   * 用于显示的面板名
   */
  name: string;
  parentId?: string;
  type: GroupPanelType;
  provider?: string; // 面板提供者
  pluginPanelName?: string; // 插件面板名
  meta?: Record<string, unknown>;
}

export interface GroupRole {
  _id: string;
  /**
   * 权限组名
   */
  name: string;
  /**
   * 拥有的权限, 是一段字符串
   */
  permissions: string[];
}

export interface GroupInfo {
  _id: string;
  name: string;
  avatar?: string;
  owner: string;
  members: GroupMember[];
  panels: GroupPanel[];
  roles: GroupRole[];
  config?: Partial<Record<GroupConfigNames, any>>;
  /**
   * 所有人的权限列表
   * 为群组中的最低权限
   */
  fallbackPermissions: string[];
  /**
   * 被钉选的面板Id
   */
  pinnedPanelId?: string;
}

/**
 * 访客级别获取群组信息
 */
export interface GroupBasicInfo {
  name: string;
  avatar?: string;
  owner: string;
  memberCount: number;
}

export interface GroupInvite {
  code: string;
  groupId: string;
  creator: string;
  expiredAt?: string;
}

/**
 * 获取群组设置信息
 */
export function getGroupConfigWithInfo(
  groupInfo: GroupInfo | null | undefined
): {
  hideGroupMemberDiscriminator: boolean;
  [key: string]: unknown;
} {
  const config = groupInfo?.config ?? {};

  return {
    ...config,
    hideGroupMemberDiscriminator: config.hideGroupMemberDiscriminator ?? false,
  };
}

/**
 * 创建群组
 * @param name 群组名
 * @param panels 初始面板
 */
export async function createGroup(
  name: string,
  panels: GroupPanel[]
): Promise<GroupInfo> {
  const { data } = await request.post('/api/group/createGroup', {
    name,
    panels,
  });

  return data;
}

/**
 * 获取群组基本信息
 */
export async function getGroupBasicInfo(
  groupId: string
): Promise<GroupBasicInfo | null> {
  const { data } = await request.get('/api/group/getGroupBasicInfo', {
    params: {
      groupId,
    },
  });

  return data;
}

/**
 * 修改群组属性
 * @param groupId 群组ID
 * @param fieldName 要修改的群组属性
 * @param fieldValue 要修改的属性的值
 */
type AllowedModifyField =
  | 'name'
  | 'avatar'
  | 'panels'
  | 'roles'
  | 'fallbackPermissions';
export async function modifyGroupField(
  groupId: string,
  fieldName: AllowedModifyField,
  fieldValue: unknown
) {
  await request.post('/api/group/updateGroupField', {
    groupId,
    fieldName,
    fieldValue,
  });
}

/**
 * 修改群组配置
 * @param groupId 群组ID
 * @param configName 要修改的群组属性
 * @param configValue 要修改的属性的值
 */
export async function modifyGroupConfig(
  groupId: string,
  configName: GroupConfigNames,
  configValue: unknown
) {
  await request.post('/api/group/updateGroupConfig', {
    groupId,
    configName,
    configValue,
  });
}

/**
 * 退出群组(群组拥有者是解散群组)
 * 这里必须是一个socket请求因为后端需要进行房间的退出操作
 * @param groupId 群组ID
 */
export async function quitGroup(groupId: string) {
  await request.post('/api/group/quitGroup', {
    groupId,
  });
}

/**
 * 检查当前用户是否是群组成员
 * @param groupId 群组ID
 */
export async function isMember(groupId: string): Promise<boolean> {
  const { data } = await request.post('/api/group/isMember', {
    groupId,
  });

  return data;
}

/**
 * 更新用户所在的权限组
 * @param groupId 群组ID
 * @param memberIds 成员信息
 * @param roles 权限组名
 */
export async function appendGroupMemberRoles(
  groupId: string,
  memberIds: string[],
  roles: string[]
) {
  await request.post('/api/group/appendGroupMemberRoles', {
    groupId,
    memberIds,
    roles,
  });
}

/**
 * 更新用户所在的权限组
 * @param groupId 群组ID
 * @param memberIds 成员信息
 * @param roles 权限组名
 */
export async function removeGroupMemberRoles(
  groupId: string,
  memberIds: string[],
  roles: string[]
) {
  await request.post('/api/group/removeGroupMemberRoles', {
    groupId,
    memberIds,
    roles,
  });
}

/**
 * 创建群组邀请码
 * 邀请码默认 7天有效期
 * @param groupId 群组id
 */
export async function createGroupInviteCode(
  groupId: string,
  inviteType: 'normal' | 'permanent'
): Promise<GroupInvite> {
  const { data } = await request.post('/api/group/invite/createGroupInvite', {
    groupId,
    inviteType,
  });

  return data;
}

/**
 * 获取群组所有邀请码
 * @param groupId 群组ID
 */
export async function getAllGroupInviteCode(
  groupId: string
): Promise<GroupInvite[]> {
  const { data } = await request.get(
    '/api/group/invite/getAllGroupInviteCode',
    {
      params: {
        groupId,
      },
    }
  );

  return data;
}

/**
 * 根据邀请码查找邀请信息
 * @param inviteCode 邀请码
 */
export async function findGroupInviteByCode(
  inviteCode: string
): Promise<GroupInvite | null> {
  const { data } = await request.get('/api/group/invite/findInviteByCode', {
    params: {
      code: inviteCode,
    },
  });

  return data;
}

/**
 * 使用群组邀请
 * 即通过群组邀请加入群组
 */
export async function applyGroupInvite(inviteCode: string): Promise<void> {
  await request.post('/api/group/invite/applyInvite', {
    code: inviteCode,
  });
}

/**
 * 删除群组邀请
 */
export async function deleteGroupInvite(
  groupId: string,
  inviteId: string
): Promise<void> {
  await request.post('/api/group/invite/deleteInvite', {
    groupId,
    inviteId,
  });
}

/**
 * 创建群组面板
 */
export async function createGroupPanel(
  groupId: string,
  options: {
    name: string;
    type: number;
    parentId?: string;
    provider?: string;
    pluginPanelName?: string;
    meta?: Record<string, unknown>;
  }
) {
  await request.post('/api/group/createGroupPanel', {
    ...options,
    groupId,
  });
}

/**
 * 创建群组面板
 */
export async function modifyGroupPanel(
  groupId: string,
  panelId: string,
  options: {
    name: string;
    type: number;
    parentId?: string;
    provider?: string;
    pluginPanelName?: string;
    meta?: Record<string, unknown>;
  }
) {
  await request.post('/api/group/modifyGroupPanel', {
    ...options,
    groupId,
    panelId,
  });
}

/**
 * 删除群组面板
 * @param groupId 群组Id
 * @param panelId 面板Id
 */
export async function deleteGroupPanel(groupId: string, panelId: string) {
  await request.post('/api/group/deleteGroupPanel', {
    groupId,
    panelId,
  });
}

/**
 * 创建群组身份组
 * @param groupId 群组id
 * @param roleName 群组名
 * @param permissions 初始权限
 */
export async function createGroupRole(
  groupId: string,
  roleName: string,
  permissions: string[]
) {
  await request.post('/api/group/createGroupRole', {
    groupId,
    roleName,
    permissions,
  });
}

/**
 * 删除群组身份组
 * @param groupId 群组Id
 * @param roleId 身份组Id
 */
export async function deleteGroupRole(groupId: string, roleId: string) {
  await request.post('/api/group/deleteGroupRole', {
    groupId,
    roleId,
  });
}

/**
 * 删除群组身份组
 * @param groupId 群组Id
 * @param roleId 身份组Id
 * @param roleName 新身份组名
 */
export async function updateGroupRoleName(
  groupId: string,
  roleId: string,
  roleName: string
) {
  await request.post('/api/group/updateGroupRoleName', {
    groupId,
    roleId,
    roleName,
  });
}

/**
 * 删除群组身份组
 * @param groupId 群组Id
 * @param roleId 身份组Id
 * @param permissions 全量权限列表
 */
export async function updateGroupRolePermission(
  groupId: string,
  roleId: string,
  permissions: string[]
) {
  await request.post('/api/group/updateGroupRolePermission', {
    groupId,
    roleId,
    permissions,
  });
}

/**
 * 禁言群组成员
 * @param groupId 群组ID
 * @param memberId 成员ID
 * @param muteMs 禁言到xxx, 精确到毫秒
 */
export async function muteGroupMember(
  groupId: string,
  memberId: string,
  muteMs: number
) {
  await request.post('/api/group/muteGroupMember', {
    groupId,
    memberId,
    muteMs,
  });
}

/**
 * 移出群组成员
 * @param groupId 群组ID
 * @param memberId 成员ID
 */
export async function deleteGroupMember(groupId: string, memberId: string) {
  await request.post('/api/group/deleteGroupMember', {
    groupId,
    memberId,
  });
}
