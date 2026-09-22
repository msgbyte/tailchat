import moment from 'moment';
import { Types } from 'mongoose';
import type {
  MessageDocument,
  MessageModel,
} from '../../../models/chat/message';
import {
  TcService,
  TcDbService,
  GroupBaseInfo,
  TcContext,
  DataNotFoundError,
  NoPermissionError,
  call,
  PERMISSION,
  SYSTEM_USERID,
  RateLimitError,
  getGroupPanelSlowMode,
} from 'tailchat-server-sdk';
import type { Group } from '../../../models/group/group';
import { isValidStr } from '../../../lib/utils';
import _ from 'lodash';
import RedisSlowModeCounter, { SlowModeRedisClient } from './slowModeCounter';

interface MessageService
  extends TcService,
    TcDbService<MessageDocument, MessageModel> {}
class MessageService extends TcService {
  private slowModeCounter?: RedisSlowModeCounter;

  get serviceName(): string {
    return 'chat.message';
  }

  private getSlowModeCounter(): RedisSlowModeCounter {
    if (this.slowModeCounter) {
      return this.slowModeCounter;
    }

    const cacher = this.broker.cacher as unknown as
      | { client?: SlowModeRedisClient; prefix?: string }
      | undefined;
    const redis = cacher?.client;
    if (!redis || typeof redis.eval !== 'function') {
      throw new Error('Slow mode requires the Redis cacher');
    }

    const keyPrefix = cacher?.prefix
      ? `${cacher.prefix}slow-mode:v1`
      : undefined;
    this.slowModeCounter = new RedisSlowModeCounter(redis, keyPrefix);
    return this.slowModeCounter;
  }

  onInit(): void {
    this.registerLocalDb(require('../../../models/chat/message').default);

    this.registerAction('fetchConverseMessage', this.fetchConverseMessage, {
      params: {
        converseId: 'string',
        startId: { type: 'string', optional: true },
      },
    });
    this.registerAction('fetchNearbyMessage', this.fetchNearbyMessage, {
      params: {
        groupId: { type: 'string', optional: true },
        converseId: 'string',
        messageId: 'string',
        num: { type: 'number', optional: true },
      },
    });
    this.registerAction('sendMessage', this.sendMessage, {
      params: {
        converseId: 'string',
        groupId: [{ type: 'string', optional: true }],
        content: 'string',
        plain: { type: 'string', optional: true },
        meta: { type: 'any', optional: true },
      },
    });
    this.registerAction('getSlowModeStatus', this.getSlowModeStatus, {
      params: {
        converseId: 'string',
        groupId: 'string',
      },
    });
    this.registerAction('resetSlowModeCounters', this.resetSlowModeCounters, {
      visibility: 'protected',
      disableSocket: true,
      params: {
        groupId: 'string',
        converseIds: { type: 'array', items: 'string' },
      },
    });
    this.registerAction('recallMessage', this.recallMessage, {
      params: {
        messageId: 'string',
      },
    });
    this.registerAction('getMessage', this.getMessage, {
      params: {
        messageId: 'string',
      },
    });
    this.registerAction('deleteMessage', this.deleteMessage, {
      params: {
        messageId: 'string',
      },
    });
    this.registerAction('searchMessage', this.searchMessage, {
      params: {
        groupId: { type: 'string', optional: true },
        converseId: 'string',
        text: 'string',
      },
    });
    this.registerAction(
      'fetchConverseLastMessages',
      this.fetchConverseLastMessages,
      {
        params: {
          converseIds: 'array',
        },
      }
    );
    this.registerAction('addReaction', this.addReaction, {
      params: {
        messageId: 'string',
        emoji: 'string',
      },
    });
    this.registerAction('removeReaction', this.removeReaction, {
      params: {
        messageId: 'string',
        emoji: 'string',
      },
    });
  }

  /**
   * 获取会话消息
   */
  async fetchConverseMessage(
    ctx: TcContext<{
      converseId: string;
      startId?: string;
    }>
  ) {
    const { converseId, startId } = ctx.params;
    await this.checkConversePermission(ctx, converseId);
    const docs = await this.adapter.model.fetchConverseMessage(
      converseId,
      startId ?? null
    );

    return this.transformDocuments(ctx, {}, docs);
  }

  /**
   * 获取一条消息附近的消息
   * 以会话为准
   *
   * 额外需要converseId是为了防止暴力查找
   */
  async fetchNearbyMessage(
    ctx: TcContext<{
      groupId?: string;
      converseId: string;
      messageId: string;
      num?: number;
    }>
  ) {
    const { groupId, converseId, messageId, num = 5 } = ctx.params;
    const { t } = ctx.meta;

    // 鉴权是否能获取到会话内容
    await this.checkConversePermission(ctx, converseId, groupId);

    const message = await this.adapter.model
      .findOne({
        _id: new Types.ObjectId(messageId),
        converseId: new Types.ObjectId(converseId),
      })
      .limit(1)
      .exec();

    if (!message) {
      throw new DataNotFoundError(t('没有找到消息'));
    }

    const [prev, next] = await Promise.all([
      this.adapter.model
        .find({
          _id: {
            $lt: new Types.ObjectId(messageId),
          },
          converseId: new Types.ObjectId(converseId),
        })
        .sort({ _id: -1 })
        .limit(num)
        .exec()
        .then((arr) => arr.reverse()),
      this.adapter.model
        .find({
          _id: {
            $gt: new Types.ObjectId(messageId),
          },
          converseId: new Types.ObjectId(converseId),
        })
        .sort({ _id: 1 })
        .limit(num)
        .exec(),
    ]);

    console.log({ prev, next });

    return this.transformDocuments(ctx, {}, [...prev, message, ...next]);
  }

  /**
   * 发送普通消息
   */
  async sendMessage(
    ctx: TcContext<{
      converseId: string;
      groupId?: string;
      content: string;
      plain?: string;
      meta?: object;
    }>
  ) {
    const { converseId, groupId, content, plain, meta } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;
    const isGroupMessage = isValidStr(groupId);

    /**
     * 鉴权
     */
    const { bypassSlowMode } = await this.checkConversePermission(
      ctx,
      converseId,
      groupId
    ); // 鉴权是否能获取到会话内容
    let slowModeReservation:
      | {
          entryId: string;
          intervalSeconds: number;
          maxMessages: number;
        }
      | undefined;
    if (isGroupMessage) {
      // 是群组消息, 鉴权是否禁言
      const groupInfo = await call(ctx).getGroupInfo(groupId);
      const member = groupInfo.members.find((m) => String(m.userId) === userId);
      if (member) {
        // 因为有机器人，所以如果没有在成员列表中找到不报错
        if (new Date(member.muteUntil).valueOf() > new Date().valueOf()) {
          throw new Error(t('您因为被禁言无法发送消息'));
        }
      }

      const panelInfo = groupInfo.panels.find(
        (panel) => String(panel.id) === converseId
      );
      if (!panelInfo) {
        throw new DataNotFoundError(t('没有找到会话信息'));
      }

      const slowMode = getGroupPanelSlowMode(panelInfo.meta);
      if (slowMode && !bypassSlowMode) {
        const result = await this.getSlowModeCounter().consume({
          converseId,
          userId,
          ...slowMode,
        });
        if (!result.accepted) {
          const resetAt = result.resetAt ?? new Date();
          const retryAfterMs =
            result.retryAfterMs ?? Math.max(resetAt.valueOf() - Date.now(), 0);
          throw new RateLimitError(
            t('慢速模式限制：请在 {{seconds}} 秒后重试', {
              seconds: Math.max(Math.ceil(retryAfterMs / 1000), 1),
            }),
            'SLOW_MODE_LIMITED',
            {
              retryAfterMs,
              resetAt: resetAt.toISOString(),
            }
          );
        }
        if (result.entryId) {
          slowModeReservation = {
            entryId: result.entryId,
            ...slowMode,
          };
        }
      }
    }

    let message: MessageDocument;
    try {
      message = await this.adapter.insert({
        converseId: new Types.ObjectId(converseId),
        groupId:
          typeof groupId === 'string' ? new Types.ObjectId(groupId) : undefined,
        author: new Types.ObjectId(userId),
        content,
        meta,
      });
    } catch (err) {
      if (slowModeReservation) {
        await this.getSlowModeCounter()
          .release({
            converseId,
            userId,
            ...slowModeReservation,
          })
          .catch((releaseError) => {
            this.logger.warn(
              'Failed to release slow mode counter',
              releaseError
            );
          });
      }
      throw err;
    }

    const json = await this.transformDocuments(ctx, {}, message);

    if (isGroupMessage) {
      this.roomcastNotify(ctx, converseId, 'add', json);
    } else {
      // 如果是私信的话需要基于用户去推送
      // 因为用户可能不订阅消息(删除了dmlist)
      const converseInfo = await call(ctx).getConverseInfo(converseId);
      if (converseInfo) {
        const converseMemberIds = converseInfo.members.map((m) => String(m));

        // 通知失败不能影响已经持久化的消息, 因此不等待也不抛出
        call(ctx)
          .isUserOnline(converseMemberIds)
          .then((onlineList) =>
            Promise.all(
              _.zip(converseMemberIds, onlineList).map(
                async ([memberId, isOnline]) => {
                  if (isOnline) {
                    // 用户在线，则直接推送，通过客户端来创建会话
                    await this.unicastNotify(ctx, memberId, 'add', json);
                  } else {
                    // 用户离线，确保追加到会话中
                    await this.broker.call(
                      'user.dmlist.addConverse',
                      { converseId },
                      { meta: { ...ctx.meta, userId: memberId } }
                    );
                  }
                }
              )
            )
          )
          .catch((error) => {
            this.logger.error(error);
          });
      }
    }

    ctx.emit('chat.message.updateMessage', {
      type: 'add',
      groupId: groupId ? String(groupId) : undefined,
      converseId: String(converseId),
      messageId: String(message._id),
      author: userId,
      content,
      plain,
      meta: meta ?? {},
    });

    return json;
  }

  async getSlowModeStatus(
    ctx: TcContext<{ converseId: string; groupId: string }>
  ) {
    const { converseId, groupId } = ctx.params;
    const { t, userId } = ctx.meta;
    const { bypassSlowMode } = await this.checkConversePermission(
      ctx,
      converseId,
      groupId
    );
    const groupInfo = await call(ctx).getGroupInfo(groupId);
    const panelInfo = groupInfo.panels.find(
      (panel) => String(panel.id) === converseId
    );
    if (!panelInfo) {
      throw new DataNotFoundError(t('没有找到会话信息'));
    }

    const slowMode = getGroupPanelSlowMode(panelInfo.meta);

    if (!slowMode) {
      return { enabled: false };
    }

    if (bypassSlowMode) {
      return {
        enabled: true,
        bypassed: true,
        ...slowMode,
        remaining: slowMode.maxMessages,
      };
    }

    const status = await this.getSlowModeCounter().getStatus({
      converseId,
      userId,
      ...slowMode,
    });

    return {
      enabled: true,
      bypassed: false,
      ...slowMode,
      remaining: status.remaining,
      resetAt: status.resetAt?.toISOString(),
    };
  }

  async resetSlowModeCounters(
    ctx: TcContext<{ groupId: string; converseIds: string[] }>
  ) {
    const { groupId, converseIds } = ctx.params;
    const { t, userId } = ctx.meta;
    const [hasPermission] = await call(ctx).checkUserPermissions(
      groupId,
      userId,
      [PERMISSION.core.managePanel]
    );
    if (!hasPermission) {
      throw new NoPermissionError(t('没有操作权限'));
    }

    const groupInfo = await call(ctx).getGroupInfo(groupId);
    const panelIds = new Set(groupInfo.panels.map((panel) => String(panel.id)));
    if (converseIds.some((converseId) => !panelIds.has(converseId))) {
      throw new DataNotFoundError(t('没有找到会话信息'));
    }

    const deletedCount = await this.getSlowModeCounter().deleteByConverseIds(
      converseIds
    );

    return { deletedCount };
  }

  /**
   * 撤回消息
   */
  async recallMessage(ctx: TcContext<{ messageId: string }>) {
    const { messageId } = ctx.params;
    const { t, userId } = ctx.meta;

    const message = await this.adapter.model.findById(messageId);
    if (!message) {
      throw new DataNotFoundError(t('该消息未找到'));
    }

    if (message.hasRecall === true) {
      throw new Error(t('该消息已被撤回'));
    }

    // 消息撤回限时
    if (
      moment().valueOf() - moment(message.createdAt).valueOf() >
      15 * 60 * 1000
    ) {
      throw new Error(t('无法撤回 {{minutes}} 分钟前的消息', { minutes: 15 }));
    }

    let allowToRecall = false;

    //#region 撤回权限检查
    const groupId = message.groupId;
    if (groupId) {
      // 是一条群组信息
      const group: GroupBaseInfo = await ctx.call('group.getGroupBasicInfo', {
        groupId: String(groupId),
      });
      if (String(group.owner) === userId) {
        allowToRecall = true; // 是管理员 允许修改
      }
    }

    if (String(message.author) === String(userId)) {
      // 撤回者是消息所有者
      allowToRecall = true;
    }

    if (allowToRecall === false) {
      throw new NoPermissionError(t('撤回失败, 没有权限'));
    }
    //#endregion

    const converseId = String(message.converseId);
    message.hasRecall = true;
    await message.save();

    const json = await this.transformDocuments(ctx, {}, message);

    this.roomcastNotify(ctx, converseId, 'update', json);
    ctx.emit('chat.message.updateMessage', {
      type: 'recall',
      groupId: groupId ? String(groupId) : undefined,
      converseId: String(converseId),
      messageId: String(message._id),
      meta: message.meta ?? {},
    });

    return json;
  }

  /**
   * 获取消息
   */
  async getMessage(ctx: TcContext<{ messageId: string }>) {
    const { messageId } = ctx.params;
    const { t, userId } = ctx.meta;
    const message = await this.adapter.model.findById(messageId);
    if (!message) {
      throw new DataNotFoundError(t('该消息未找到'));
    }
    const converseId = String(message.converseId);
    const groupId = message.groupId;
    // 鉴权
    if (!groupId) {
      // 私人会话
      const converseInfo = await call(ctx).getConverseInfo(converseId);
      if (!converseInfo.members.map((m) => String(m)).includes(userId)) {
        throw new NoPermissionError(t('没有当前会话权限'));
      }
    } else {
      // 群组会话
      const groupInfo = await call(ctx).getGroupInfo(String(groupId));
      if (!groupInfo.members.map((m) => m.userId).includes(userId)) {
        throw new NoPermissionError(t('没有当前会话权限'));
      }
    }
    return message;
  }

  /**
   * 删除消息
   * 仅支持群组
   */
  async deleteMessage(ctx: TcContext<{ messageId: string }>) {
    const { messageId } = ctx.params;
    const { t, userId } = ctx.meta;

    const message = await this.adapter.model.findById(messageId);
    if (!message) {
      throw new DataNotFoundError(t('该消息未找到'));
    }

    const converseId = String(message.converseId);
    const groupId = message.groupId;
    if (!groupId) {
      // 私人会话
      if (userId !== SYSTEM_USERID) {
        // 如果是私人发起的, 则直接抛出异常
        throw new Error(t('无法删除私人信息'));
      }
    } else {
      // 群组会话, 进行权限校验
      const [hasPermission] = await call(ctx).checkUserPermissions(
        String(groupId),
        userId,
        [PERMISSION.core.deleteMessage]
      );

      if (!hasPermission) {
        throw new NoPermissionError(t('没有删除权限')); // 仅管理员允许删除
      }
    }

    await this.adapter.removeById(messageId); // TODO: 考虑是否要改为软删除

    this.roomcastNotify(ctx, converseId, 'delete', { converseId, messageId });
    ctx.emit('chat.message.updateMessage', {
      type: 'delete',
      groupId: groupId ? String(groupId) : undefined,
      converseId: String(converseId),
      messageId: String(message._id),
      meta: message.meta ?? {},
    });

    return true;
  }

  /**
   * 搜索消息
   */
  async searchMessage(
    ctx: TcContext<{ groupId?: string; converseId: string; text: string }>
  ) {
    const { groupId, converseId, text } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    if (groupId) {
      const groupInfo = await call(ctx).getGroupInfo(groupId);
      if (!groupInfo.members.map((m) => m.userId).includes(userId)) {
        throw new Error(t('不是群组成员无法搜索消息'));
      }
    } else {
      await this.checkConversePermission(ctx, converseId);
    }

    const messages = this.adapter.model
      .find({
        groupId: groupId ?? null,
        converseId,
        content: {
          $regex: text,
        },
        author: {
          $not: {
            $eq: SYSTEM_USERID,
          },
        },
      })
      .sort({ _id: -1 })
      .limit(10)
      .maxTimeMS(5 * 1000); // 超过5s的查询直接放弃

    return messages;
  }

  /**
   * 基于会话id获取会话最后一条消息的id
   */
  async fetchConverseLastMessages(ctx: TcContext<{ converseIds: string[] }>) {
    const { converseIds } = ctx.params;

    // 这里使用了多个请求，但是通过limit=1会将查询范围降低到最低
    // 这种方式会比用聚合操作实际上更加节省资源
    const list = await Promise.all(
      converseIds.map((id) => {
        return this.adapter.model
          .findOne(
            {
              converseId: new Types.ObjectId(id),
            },
            {
              _id: 1,
              converseId: 1,
            }
          )
          .sort({
            _id: -1,
          })
          .limit(1)
          .exec();
      })
    );

    return list.map((item) =>
      item
        ? {
            converseId: String(item.converseId),
            lastMessageId: String(item._id),
          }
        : null
    );
  }

  async addReaction(
    ctx: TcContext<{
      messageId: string;
      emoji: string;
    }>
  ) {
    const { messageId, emoji } = ctx.params;
    const userId = ctx.meta.userId;

    const message = await this.adapter.model.findById(messageId);
    if (!message) {
      throw new DataNotFoundError();
    }
    if (!message.groupId) {
      await this.checkConversePermission(ctx, String(message.converseId));
    }

    const appendReaction = {
      name: emoji,
      author: new Types.ObjectId(userId),
    };

    await this.adapter.model.updateOne(
      {
        _id: messageId,
      },
      {
        $push: {
          reactions: {
            ...appendReaction,
          },
        },
      }
    );

    const converseId = String(message.converseId);
    this.roomcastNotify(ctx, converseId, 'addReaction', {
      converseId,
      messageId,
      reaction: {
        ...appendReaction,
      },
    });

    return true;
  }

  async removeReaction(
    ctx: TcContext<{
      messageId: string;
      emoji: string;
    }>
  ) {
    const { messageId, emoji } = ctx.params;
    const userId = ctx.meta.userId;

    const message = await this.adapter.model.findById(messageId);
    if (!message) {
      throw new DataNotFoundError();
    }
    if (!message.groupId) {
      await this.checkConversePermission(ctx, String(message.converseId));
    }

    const removedReaction = {
      name: emoji,
      author: new Types.ObjectId(userId),
    };

    await this.adapter.model.updateOne(
      {
        _id: messageId,
      },
      {
        $pull: {
          reactions: {
            ...removedReaction,
          },
        },
      }
    );

    const converseId = String(message.converseId);
    this.roomcastNotify(ctx, converseId, 'removeReaction', {
      converseId,
      messageId,
      reaction: {
        ...removedReaction,
      },
    });

    return true;
  }

  /**
   * 校验会话权限，如果没有抛出异常则视为正常
   */
  private async checkConversePermission(
    ctx: TcContext,
    converseId: string,
    groupId?: string
  ): Promise<{ bypassSlowMode: boolean }> {
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;
    if (userId === SYSTEM_USERID) {
      return { bypassSlowMode: true };
    }

    const userInfo = await call(ctx).getUserInfo(userId); // TODO: 可以通过在默认的meta信息中追加用户类型来减少一次请求来优化
    if (userInfo.type === 'pluginBot') {
      // 插件机器人可以不加入群组直接发送插件消息，但仍受频道慢速模式限制
      return { bypassSlowMode: false };
    }

    // 鉴权是否能获取到会话内容
    if (groupId) {
      // 是群组: 必须是群组成员, 且会话必须是该群组的面板, 防止用无关群组冒充私信会话
      const group = await call(ctx).getGroupInfo(groupId);
      if (
        !group.members.some((m) => String(m.userId) === userId) ||
        !group.panels.some((panel) => String(panel.id) === converseId)
      ) {
        throw new NoPermissionError(t('没有当前会话权限'));
      }
      return { bypassSlowMode: false };
    }

    // 是普通会话: 非成员由 findConverseInfo 拒绝(403)
    let converse;
    try {
      converse = await ctx.call<any, { converseId: string }>(
        'chat.converse.findConverseInfo',
        { converseId }
      );
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }
    if (converse) {
      return { bypassSlowMode: false };
    }

    // 群组面板没有会话记录(404), 按已加入的群组面板校验
    const { textPanelIds, subscribeFeaturePanelIds } = await ctx.call<{
      textPanelIds: string[];
      subscribeFeaturePanelIds: string[];
    }>('group.getJoinedGroupAndPanelIds');
    if (![...textPanelIds, ...subscribeFeaturePanelIds].includes(converseId)) {
      throw new NoPermissionError(t('没有当前会话权限'));
    }

    return { bypassSlowMode: false };
  }
}

export default MessageService;
