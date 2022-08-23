export const NAME_REGEXP =
  /^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]|[\u3040-\u309Fー]|[\u30A0-\u30FF]){1,8}$/;

/**
 * TODO: 待实现权限相关逻辑
 *
 * 标准群组权限
 * key为权限
 * value为默认值
 */
export const BUILTIN_GROUP_PERM = {
  /**
   * 查看频道
   */
  displayChannel: true,

  /**
   * 管理频道
   */
  manageChannel: false,

  /**
   * 管理角色
   */
  manageRole: false,

  /**
   * 管理群组
   */
  manageGroup: false,

  /**
   * 发送消息
   */
  sendMessage: true,

  /**
   * 发送图片
   */
  sendImage: true,
};

/**
 * 系统用户id
 */
export const SYSTEM_USERID = '000000000000000000000000';
