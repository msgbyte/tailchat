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
