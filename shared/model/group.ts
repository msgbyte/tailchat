import { request } from '../api/request';

export enum GroupPanelType {
  TEXT = 0,
  GROUP = 1,
  PLUGIN = 2,
}

export interface GroupMember {
  role: string; // 角色
  userId: string;
}

export interface GroupPanel {
  id: string; // 在群组中唯一
  name: string;
  parentId?: string;
  type: GroupPanelType;
  provider?: string; // 面板提供者
  pluginPanelName?: string; // 插件面板名
  meta?: Record<string, unknown>;
}

export interface GroupInfo {
  _id: string;
  name: string;
  avatar?: string;
  owner: string;
  members: GroupMember[];
  panels: GroupPanel[];
}

/**
 * 访客级别获取群组信息
 */
export interface GroupBasicInfo {
  name: string;
  avatar?: string;
  owner: string;
  memberCount: GroupMember[];
}

export interface GroupInvite {
  code: string;
  groupId: string;
  creator: string;
  expiredAt?: string;
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
type AllowedModifyField = 'name' | 'avatar' | 'panels' | 'roles';
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
 * 创建群组邀请码
 * 邀请码默认 7天有效期
 * @param groupId 群组id
 */
export async function createGroupInviteCode(
  groupId: string
): Promise<GroupInvite> {
  const { data } = await request.post('/api/group/invite/createGroupInvite', {
    groupId,
  });

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
