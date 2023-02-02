import _ from 'lodash';
import { TcService, TcDbService, TcContext, call } from 'tailchat-server-sdk';
import type { GroupTopicDocument, GroupTopicModel } from '../models/topic';

/**
 * 群组话题
 */
interface GroupTopicService
  extends TcService,
    TcDbService<GroupTopicDocument, GroupTopicModel> {}
class GroupTopicService extends TcService {
  get serviceName(): string {
    return 'plugin:com.msgbyte.topic';
  }

  onInit(): void {
    this.registerLocalDb(require('../models/topic').default);

    this.registerAction('list', this.list, {
      params: {
        groupId: 'string',
        panelId: 'string',
        page: { type: 'number', optional: true },
        size: { type: 'number', optional: true },
      },
    });
    this.registerAction('create', this.create, {
      params: {
        groupId: 'string',
        panelId: 'string',
        content: 'string',
        meta: { type: 'object', optional: true },
      },
    });
    this.registerAction('createComment', this.createComment, {
      params: {
        groupId: 'string',
        panelId: 'string',
        topicId: 'string',
        content: 'string',
        replyCommentId: { type: 'string', optional: true },
      },
    });
  }

  protected onInited(): void {
    this.setPanelFeature('com.msgbyte.topic/grouppanel', ['subscribe']);
  }

  /**
   * 获取所有Topic
   */
  async list(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      page?: number;
      size?: number;
    }>
  ) {
    const { groupId, panelId, page = 1, size = 20 } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    // 鉴权
    const group = await call(ctx).getGroupInfo(groupId);
    const isMember = group.members.some((member) => {
      return String(member.userId) === userId;
    });
    if (!isMember) {
      throw new Error(t('不是该群组成员'));
    }

    const topic = await this.adapter.model
      .find({
        groupId,
        panelId,
      })
      .limit(size)
      .skip((page - 1) * 20)
      .sort({ _id: 'desc' })
      .exec();

    const json = await this.transformDocuments(ctx, {}, topic);

    return json;
  }

  /**
   * 创建一条Topic
   */
  async create(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      content: string;
      meta?: object;
    }>
  ) {
    const { groupId, panelId, content, meta } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    // 鉴权
    const group = await call(ctx).getGroupInfo(groupId);
    const isMember = group.members.some((member) => member.userId === userId);
    if (!isMember) {
      throw new Error(t('不是该群组成员'));
    }

    const targetPanel = group.panels.find((p) => p.id === panelId);

    if (!targetPanel) {
      throw new Error(t('面板不存在'));
    }

    const topic = await this.adapter.model.create({
      groupId,
      panelId,
      content,
      meta,
      author: userId,
      comment: [],
    });

    const json = await this.transformDocuments(ctx, {}, topic);

    this.roomcastNotify(ctx, panelId, 'create', json);

    return json;
  }

  /**
   * 回复话题
   */
  async createComment(
    ctx: TcContext<{
      groupId: string;
      panelId: string;
      topicId: string;
      content: string;
      replyCommentId?: string;
    }>
  ) {
    const { groupId, panelId, topicId, content, replyCommentId } = ctx.params;
    const userId = ctx.meta.userId;
    const t = ctx.meta.t;

    // 鉴权
    const group = await call(ctx).getGroupInfo(groupId);
    const isMember = group.members.some((member) => member.userId === userId);
    if (!isMember) {
      throw new Error(t('不是该群组成员'));
    }

    const targetPanel = group.panels.find((p) => p.id === panelId);

    if (!targetPanel) {
      throw new Error(t('面板不存在'));
    }

    const topic = await this.adapter.model.findOneAndUpdate(
      {
        _id: topicId,
        groupId,
        panelId,
      },
      {
        $push: {
          comments: {
            content,
            author: userId,
            replyCommentId,
          },
        },
      },
      { new: true }
    );

    const json = await this.transformDocuments(ctx, {}, topic);

    // TODO: 回复需要添加到收件箱

    this.roomcastNotify(ctx, panelId, 'createComment', json);

    return true;
  }
}

export default GroupTopicService;
