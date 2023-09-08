export interface GroupInfo {
  _id: string;
  name: string;
  avatar?: string;
  owner: string;
  description: string;
  members: GroupMember[];
  panels: GroupPanel[];
  roles: GroupRole[];
  /**
   * 所有人的权限列表
   * 为群组中的最低权限
   */
  fallbackPermissions: string[];
  /**
   * 群组的配置信息
   */
  config: object;
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

export interface GroupMember {
  roles?: string[]; // 角色权限组id
  userId: string;
  /**
   * 禁言到xxx 为止
   */
  muteUntil?: string;
}

export enum GroupPanelType {
  TEXT = 0,
  GROUP = 1,
  PLUGIN = 2,
}

export interface GroupPanel {
  id: string; // 在群组中唯一, 可以用任意方式进行生成。这里使用ObjectId, 但不是ObjectId类型
  name: string; // 用于显示的名称
  parentId?: string; // 父节点id

  /**
   * 面板类型:
   *  0 文本频道
   *  1 面板分组
   *  2 插件
   *
   * Reference: https://discord.com/developers/docs/resources/channel#channel-object-channel-types
   */
  type: GroupPanelType;
  provider?: string; // 面板提供者，为插件的标识，仅面板类型为插件时有效
  pluginPanelName?: string; // 插件面板名, 如 com.msgbyte.webview/grouppanel
  /**
   * 面板的其他数据
   */
  meta?: object;

  /**
   * 身份组或者用户的权限
   * 如果没有设定则应用群组权限
   *
   * key 为身份组id或者用户id
   * value 为权限字符串列表
   */
  permissionMap?: Record<string, string[]>;

  /**
   * 所有人的权限列表
   * 如果没有设定则应用群组权限
   */
  fallbackPermissions?: string[];
}

/**
 * 访客级别获取群组信息
 */
export interface GroupBasicInfo {
  name: string;
  avatar?: string;
  owner: string;
  memberCount: number;
  backgroundImage?: string;
}

export interface GroupInvite {
  code: string;
  groupId: string;
  creator: string;
  expiredAt?: string;
  usage: number;
  usageLimit?: number;
}
