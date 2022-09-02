import {
  TcService,
  TcDbService,
  TcContext,
  NoPermissionError,
} from 'tailchat-server-sdk';
import type { TaskDocument, TaskModel } from '../models/task';

/**
 * 任务管理服务
 */
interface TasksService
  extends TcService,
    TcDbService<TaskDocument, TaskModel> {}
class TasksService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.tasks';
  }

  onInit() {
    this.registerLocalDb(require('../models/task').default);

    this.registerAction('all', this.all);
    this.registerAction('add', this.add, {
      params: {
        title: 'string',
        assignee: { optional: true, type: 'array', items: 'string' },
        description: { optional: true, type: 'string' },
        expiredAt: { optional: true, type: 'string' },
      },
    });
    this.registerAction('done', this.done, {
      params: {
        taskId: 'string',
      },
    });
    this.registerAction('undone', this.undone, {
      params: {
        taskId: 'string',
      },
    });
    this.registerAction('update', this.update, {
      params: {
        taskId: 'string',
        title: { optional: true, type: 'string' },
        assignee: { optional: true, type: 'string' },
        description: { optional: true, type: 'string' },
        expiredAt: { optional: true, type: 'string' },
      },
    });
  }

  /**
   * 列出所有任务
   */
  private async all(ctx: TcContext) {
    const docs = await this.adapter.model
      .find({
        creator: ctx.meta.userId,
      })
      .sort({
        _id: 'desc',
      })
      .exec();

    return await this.transformDocuments(ctx, {}, docs);
  }

  /**
   * 新增任务
   */
  private async add(
    ctx: TcContext<{
      title: string;
      assignee?: string[];
      description?: string;
      expiredAt?: string;
    }>
  ) {
    const { title, assignee, description, expiredAt } = ctx.params;
    const docs = await this.adapter.model.create({
      creator: ctx.meta.userId,
      title,
      assignee,
      description,
      expiredAt,
      done: false,
    });

    return await this.transformDocuments(ctx, {}, docs);
  }

  /**
   * 完成任务
   */
  private async done(
    ctx: TcContext<{
      taskId: string;
    }>
  ) {
    const taskId = ctx.params.taskId;
    const t = ctx.meta.t;

    const res = await this.adapter.model.updateOne(
      {
        _id: taskId,
        creator: ctx.meta.userId,
      },
      {
        done: true,
      }
    );

    if (res.matchedCount === 0) {
      throw new NoPermissionError(t('没有修改权限'));
    }
  }

  /**
   * 完成任务
   */
  private async undone(
    ctx: TcContext<{
      taskId: string;
    }>
  ) {
    const taskId = ctx.params.taskId;
    const t = ctx.meta.t;

    const res = await this.adapter.model.updateOne(
      {
        _id: taskId,
        creator: ctx.meta.userId,
      },
      {
        done: false,
      }
    );

    if (res.matchedCount === 0) {
      throw new NoPermissionError(t('没有修改权限'));
    }
  }

  /**
   * 更新任务信息
   */
  private async update(
    ctx: TcContext<{
      taskId: string;
      title: string;
      assignee?: string[];
      description?: string;
      expiredAt?: Date;
    }>
  ) {
    const { taskId, title, assignee, description, expiredAt } = ctx.params;
    const t = ctx.meta.t;

    const docs = await this.adapter.model.findOneAndUpdate(
      {
        _id: taskId,
        creator: ctx.meta.userId,
      },
      {
        title,
        assignee,
        description,
        expiredAt,
      },
      { new: true }
    );

    if (!docs) {
      throw new NoPermissionError(t('没有修改权限'));
    }

    return await this.transformDocuments(ctx, {}, docs);
  }
}

export default TasksService;
