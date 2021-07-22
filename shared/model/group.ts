export enum GroupPanelType {
  TEXT = 0,
  GROUP = 1,
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
