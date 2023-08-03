import { call, TcContext } from 'tailchat-server-sdk';
import { TcService } from 'tailchat-server-sdk';

/**
 * Autojoin Group
 *
 * Auto join group after register
 */
class AutojoinGroupService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.autojoinGroup';
  }

  get autojoinGroupIds(): string[] | null {
    const ids = process.env.AUTOJOIN_GROUP_ID;
    if (!ids) {
      return null;
    }

    return ids.split(',');
  }

  onInit() {
    if (!this.autojoinGroupIds) {
      return;
    }

    this.registerAfterActionHook('user.register', 'autojoinGroup');
    this.registerAfterActionHook('user.createTemporaryUser', 'autojoinGroup');

    this.registerAction('autojoinGroup', this.autojoinGroup, {
      visibility: 'public',
    });
  }

  async autojoinGroup(ctx: TcContext) {
    const autojoinGroupIds = this.autojoinGroupIds;
    if (!autojoinGroupIds) {
      return;
    }

    console.log(ctx.params, ctx.meta);

    const userId = ctx.meta.actionResult?._id;
    const t = ctx.meta.t;

    if (!userId) {
      this.logger.fatal('Autojoin Group Failed: cannot found userId from ctx');
      return;
    }

    await Promise.all(
      autojoinGroupIds.map(async (groupId: string) => {
        await ctx.call('group.addMember', {
          groupId,
          userId,
        });

        const nickname = ctx.meta.actionResult?.nickname;
        await call(ctx).addGroupSystemMessage(
          String(groupId),
          t('{{nickname}} 通过系统自动加入群组', {
            nickname,
          })
        );
      })
    );
  }
}

export default AutojoinGroupService;
