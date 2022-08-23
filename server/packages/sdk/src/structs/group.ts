export enum GroupPanelType {
  TEXT = 0,
  GROUP = 1,
  PLUGIN = 2,
}

interface GroupMemberStruct {
  roles?: string[]; // 角色

  userId: string;
}

export interface GroupPanelStruct {
  id: string; // 在群组中唯一, 可以用任意方式进行生成。这里使用ObjectId, 但不是ObjectId类型

  name: string; // 用于显示的名称

  parentId?: string; // 父节点id

  type: number; // 面板类型: Reference: https://discord.com/developers/docs/resources/channel#channel-object-channel-types

  provider?: string; // 面板提供者，为插件的标识，仅面板类型为插件时有效

  pluginPanelName?: string; // 插件面板名, 如 com.msgbyte.webview/grouppanel

  /**
   * 面板的其他数据
   */
  meta?: object;
}

/**
 * 群组权限组
 */
export interface GroupRoleStruct {
  name: string; // 权限组名
  permissions: string[]; // 拥有的权限, 是一段字符串
}

export interface GroupStruct {
  name: string;

  avatar?: string;

  owner: string;

  members: GroupMemberStruct[];

  panels: GroupPanelStruct[];

  roles?: GroupRoleStruct[];
}
