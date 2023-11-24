export const PERMISSION = {
  /**
   * 非插件的权限点都叫core
   */
  core: {
    owner: '__group_owner__', // 保留字段, 用于标识群组所有者
    message: 'core.message',
    invite: 'core.invite',
    unlimitedInvite: 'core.unlimitedInvite',
    editInvite: 'core.editInvite', // 编辑邀请码权限，需要有创建无限制邀请码的权限
    groupDetail: 'core.groupDetail',
    groupBaseInfo: 'core.groupBaseInfo',
    groupConfig: 'core.groupConfig',
    manageUser: 'core.manageUser',
    managePanel: 'core.managePanel',
    manageInvite: 'core.manageInvite',
    manageRoles: 'core.manageRoles',
    deleteMessage: 'core.deleteMessage',
  },
};

export const allPermission = [...Object.values(PERMISSION.core)];
