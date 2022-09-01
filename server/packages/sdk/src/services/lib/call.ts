import { GroupStruct, UserStruct, SYSTEM_USERID, TcContext } from '../../index';

export function call(ctx: TcContext) {
  return {
    /**
     * 发送系统消息
     * 如果为群组消息则需要增加groupId
     */
    async sendSystemMessage(
      message: string,
      converseId: string,
      groupId?: string
    ) {
      await ctx.call(
        'chat.message.sendMessage',
        {
          converseId,
          groupId,
          content: message,
        },
        {
          meta: {
            ...ctx.meta,
            userId: SYSTEM_USERID,
          },
        }
      );
    },
    /**
     * 添加群组系统信息
     */
    async addGroupSystemMessage(groupId: string, message: string) {
      const lobbyConverseId = await ctx.call('group.getGroupLobbyConverseId', {
        groupId,
      });

      if (!lobbyConverseId) {
        // 如果没有文本频道则跳过
        return;
      }

      await ctx.call(
        'chat.message.sendMessage',
        {
          converseId: lobbyConverseId,
          groupId: groupId,
          content: message,
        },
        {
          meta: {
            ...ctx.meta,
            userId: SYSTEM_USERID,
          },
        }
      );
    },

    /**
     * 获取用户信息
     */
    async getUserInfo(userId: string): Promise<UserStruct> {
      return await ctx.call('user.getUserInfo', {
        userId,
      });
    },
    /**
     * 获取群组信息
     */
    async getGroupInfo(groupId: string): Promise<GroupStruct> {
      return await ctx.call('group.getGroupInfo', {
        groupId,
      });
    },
    /**
     * 检查群组成员权限
     */
    async checkUserPermissions(
      groupId: string,
      userId: string,
      permissions: string[]
    ): Promise<boolean[]> {
      const userAllPermissions: string[] = await ctx.call(
        'group.getUserAllPermissions',
        {
          groupId,
          userId,
        }
      );

      return permissions.map((p) => (userAllPermissions ?? []).includes(p));
    },
  };
}
