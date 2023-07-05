import type { TcContext } from 'tailchat-server-sdk';
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
  }

  async all(ctx: TcContext<{ page: number; size: number }>) {
    const { page, size } = ctx.params;

    const docs = await this.adapter.model
      .find({
        active: true,
      })
      .limit(size)
      .skip(size * (page - 1));

    const list = await this.transformDocuments(ctx, {}, docs);

    return { list };
  }
}

export default DiscoverService;
