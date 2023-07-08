import { call, TcContext } from 'tailchat-server-sdk';
import { TcService, TcDbService } from 'tailchat-server-sdk';
import type { DiscoverDocument, DiscoverModel } from '../models/discover';

/**
 * Discover
 *
 * Add Discover panel which can help user found groups
 */
interface DiscoverService
  extends TcService,
    TcDbService<DiscoverDocument, DiscoverModel> {}
class DiscoverService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.discover';
  }

  onInit() {
    this.registerLocalDb(require('../models/discover').default);

    this.registerAction('all', this.all, {
      params: {
        page: { type: 'number', default: 1 },
        size: { type: 'number', default: 20 },
      },
    });
    this.registerAction('join', this.join, {
      params: {
        groupId: 'string',
      },
    });
  }

  async all(ctx: TcContext<{ page: number; size: number }>) {
    const { page, size } = ctx.params;

    const docs = await this.adapter.model
      .find({
        active: true,
      })
      .sort({ order: 'desc' })
      .limit(size)
      .skip(size * (page - 1))
      .exec();

    const list = await this.transformDocuments(ctx, {}, docs);

    return { list };
  }

  async join(ctx: TcContext<{ groupId: string }>) {
    const { groupId } = ctx.params;
    const t = ctx.meta.t;

    const isExists = await this.adapter.model.exists({
      groupId,
      active: true,
    });

    if (!isExists) {
      throw new Error(t('该群组并非公开群组, 无法直接加入'));
    }

    await ctx.call('group.joinGroup', {
      groupId: String(groupId),
    });

    await call(ctx).addGroupSystemMessage(
      String(groupId),
      t('{{nickname}} 通过公共社区加入群组', {
        nickname: ctx.meta.user.nickname,
      })
    );
  }
}

export default DiscoverService;
