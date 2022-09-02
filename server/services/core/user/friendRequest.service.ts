import {
  TcService,
  TcDbService,
  TcContext,
  Errors,
  DataNotFoundError,
  NoPermissionError,
} from 'tailchat-server-sdk';
import _ from 'lodash';
import type { FriendRequest } from '../../../models/user/friendRequest';

interface FriendService extends TcService, TcDbService<any> {}
class FriendService extends TcService {
  get serviceName(): string {
    return 'friend.request';
  }
  onInit(): void {
    this.registerLocalDb(require('../../../models/user/friendRequest').default);
    // this.registerMixin(TcCacheCleaner(['cache.clean.friend']));

    this.registerAction('add', this.add, {
      params: {
        to: 'string',
        message: [{ type: 'string', optional: true }],
      },
    });
    this.registerAction('allRelated', this.allRelated);
    this.registerAction('accept', this.accept, {
      params: {
        requestId: 'string',
      },
    });
    this.registerAction('deny', this.deny, {
      params: {
        requestId: 'string',
      },
    });
    this.registerAction('cancel', this.cancel, {
      params: {
        requestId: 'string',
      },
    });
  }

  /**
   * 请求添加好友
   */
  async add(ctx: TcContext<{ to: string; message?: string }>) {
    const from = ctx.meta.userId;

    const { to, message } = ctx.params;

    if (from === to) {
      throw new Errors.ValidationError('不能添加自己为好友');
    }

    const exist = await this.adapter.findOne({
      from,
      to,
    });
    if (exist) {
      throw new Errors.MoleculerError('不能发送重复的好友请求');
    }

    const isFriend = await ctx.call('friend.checkIsFriend', { targetId: to });
    if (isFriend) {
      throw new Error('对方已经是您的好友, 不能再次添加');
    }

    const doc = await this.adapter.insert({
      from,
      to,
      message,
    });
    const request = await this.transformDocuments(ctx, {}, doc);

    this.listcastNotify(ctx, [from, to], 'add', request);

    return request;
  }

  /**
   * 所有与自己相关的好友请求
   */
  async allRelated(ctx: TcContext) {
    const userId = ctx.meta.userId;

    const doc = await this.adapter.find({
      query: {
        $or: [{ from: userId }, { to: userId }],
      },
    });

    const list = await await this.transformDocuments(ctx, {}, doc);
    return list;
  }

  /**
   * 接受好友请求
   */
  async accept(ctx: TcContext<{ requestId: string }>) {
    const requestId = ctx.params.requestId;

    const request: FriendRequest = await this.adapter.findById(requestId);
    if (_.isNil(request)) {
      throw new DataNotFoundError('该好友请求未找到');
    }

    if (ctx.meta.userId !== String(request.to)) {
      throw new NoPermissionError();
    }

    await ctx.call('friend.buildFriendRelation', {
      user1: String(request.from),
      user2: String(request.to),
    });

    await this.adapter.removeById(request._id);

    this.listcastNotify(
      ctx,
      [String(request.from), String(request.to)],
      'remove',
      {
        requestId,
      }
    );
  }

  /**
   * 拒绝好友请求
   */
  async deny(ctx: TcContext<{ requestId: string }>) {
    const requestId = ctx.params.requestId;

    const request: FriendRequest = await this.adapter.findById(requestId);
    if (_.isNil(request)) {
      throw new DataNotFoundError('该好友请求未找到');
    }

    if (ctx.meta.userId !== String(request.to)) {
      throw new NoPermissionError();
    }

    await this.adapter.removeById(request._id);

    this.listcastNotify(
      ctx,
      [String(request.from), String(request.to)],
      'remove',
      {
        requestId,
      }
    );
  }

  /**
   * 取消好友请求
   */
  async cancel(ctx: TcContext<{ requestId: string }>) {
    const requestId = ctx.params.requestId;

    const request: FriendRequest = await this.adapter.findById(requestId);
    if (_.isNil(request)) {
      throw new DataNotFoundError('该好友请求未找到');
    }

    if (ctx.meta.userId !== String(request.from)) {
      throw new NoPermissionError();
    }

    await this.adapter.removeById(request._id);

    this.listcastNotify(
      ctx,
      [String(request.from), String(request.to)],
      'remove',
      {
        requestId,
      }
    );
  }
}
export default FriendService;
