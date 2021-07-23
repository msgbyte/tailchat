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
  creator: string;
  members: GroupMember[];
  panels: GroupPanel[];
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
