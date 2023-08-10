import {
  GroupStruct,
  UserStruct,
  SYSTEM_USERID,
  PERMISSION,
  TcPureContext,
} from '../../index';

export function call(ctx: TcPureContext) {
  return {
    /**
     * 加入socketio房间
     */
    async joinSocketIORoom(roomIds: string[], userId?: string) {
      await ctx.call('gateway.joinRoom', {
        roomIds,
        userId,
      });
    },
    /**
     * 离开socketio房间
     */
    async leaveSocketIORoom(roomIds: string[], userId?: string) {
      await ctx.call('gateway.leaveRoom', {
        roomIds,
        userId,
      });
    },
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
     * 获取群组大厅会话的id
     */
    async getGroupLobbyConverseId(groupId: string): Promise<string | null> {
      const lobbyConverseId: string = await ctx.call(
        'group.getGroupLobbyConverseId',
        {
          groupId,
        }
      );

      return lobbyConverseId;
    },
    /**
     * 添加群组系统信息
     */
    async addGroupSystemMessage(groupId: string, message: string) {
      const lobbyConverseId = await call(ctx).getGroupLobbyConverseId(groupId);

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
    async getUserInfo(userId: string): Promise<UserStruct | null> {
      return await ctx.call('user.getUserInfo', {
        userId: String(userId),
      });
    },
    /**
     * 获取群组信息
     */
    async getGroupInfo(groupId: string): Promise<GroupStruct | null> {
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

      const hasOwnerPermission = userAllPermissions.includes(
        PERMISSION.core.owner
      );

      return permissions.map((p) =>
        hasOwnerPermission
          ? true // 如果有管理员权限。直接返回true
          : (userAllPermissions ?? []).includes(p)
      );
    },
    /**
     * 添加到收件箱
     * @param type 如果是插件则命名规范为包名加信息名，如: plugin:com.msgbyte.topic
     * @param payload 内容体，相关的逻辑由前端处理
     * @param userId 如果是添加到当前用户则userId可以不填
     */
    async appendInbox(
      type: string,
      payload: any,
      userId?: string
    ): Promise<boolean> {
      return await ctx.call('chat.inbox.append', {
        userId,
        type,
        payload,
      });
    },
  };
}
