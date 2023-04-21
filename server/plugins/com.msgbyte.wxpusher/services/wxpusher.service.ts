import { TcService, TcDbService, InboxStruct, call } from 'tailchat-server-sdk';
import type {
  WXPusherUserDocument,
  WXPusherUserModel,
} from '../models/wxpusher-user';
import got from 'got';
import type { TcContext } from 'tailchat-server-sdk';

/**
 * wxpusher
 *
 * Add support for wxpusher to notify user
 */
interface WxpusherService
  extends TcService,
    TcDbService<WXPusherUserDocument, WXPusherUserModel> {}
class WxpusherService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.wxpusher';
  }

  get appToken() {
    return process.env.WXPUSHER_APP_TOKEN;
  }

  /**
   * 返回服务是否可用
   */
  get serverAvailable(): boolean {
    return Boolean(this.appToken);
  }

  onInit() {
    this.registerLocalDb(require('../models/wxpusher-user').default);
    this.registerAvailableAction(() => this.serverAvailable);

    if (!this.serverAvailable) {
      console.warn(
        '[plugin:com.msgbyte.wxpusher] require env: WXPUSHER_APP_TOKEN'
      );
      return;
    }

    this.registerEventListener(
      'chat.inbox.append',
      async (inboxItem: InboxStruct, ctx) => {
        if (inboxItem.type === 'message') {
          const userId = inboxItem.userId;
          const message = inboxItem.payload;

          let title = 'new';
          if (message.groupId) {
            const groupInfo = await call(ctx).getGroupInfo(message.groupId);
            title = `来自群组: ${groupInfo.name}`; // 因为wxpusher插件仅适用于中国大陆，因此仅需要中文即可
          }
          const content = message.messagePlainContent ?? message.messageSnippet; // 优先使用去节点的内容

          try {
            await this.sendMessage(userId, [title, content].join('\n'));
          } catch (err) {
            console.error(err);
          }
        }
      }
    );

    this.registerAction('getWXPusherUserId', this.getWXPusherUserId);
    this.registerAction('createQRCode', this.createQRCode);
    this.registerAction('callback', this.callback, {
      params: {
        action: 'string',
        data: 'any',
      },
    });

    this.registerAuthWhitelist(['/callback']);
  }

  async getWXPusherUserId(ctx: TcContext) {
    const userId = ctx.meta.userId;

    return await this.findUserWxpusherUid(userId);
  }

  async createQRCode(ctx: TcContext) {
    const userId = ctx.meta.userId;

    const json = await got
      .post('https://wxpusher.zjiecode.com/api/fun/create/qrcode', {
        json: {
          appToken: this.appToken, // 必填，appToken,前面有说明，应用的标志
          extra: userId, // 必填，二维码携带的参数，最长64位
          validTime: 1800, // 可选，二维码的有效期，默认30分钟，最长30天，单位是秒
        },
      })
      .json();

    return json;
  }

  async callback(
    ctx: TcContext<{
      action: string;
      data: any;
    }>
  ) {
    const { action, data } = ctx.params;

    if (action === 'app_subscribe') {
      this.logger.info('data', data);
      // Reference: https://wxpusher.zjiecode.com/docs/#/?id=subscribe-callback
      const userId = data.extra;
      const wxpusherUserId = data.uid;

      const record = await this.adapter.model.findOne({ userId });
      if (!record) {
        // 新增
        await this.adapter.model.create({
          userId,
          wxpusherUserId,
        });
      } else {
        record.wxpusherUserId = wxpusherUserId;
        await record.save();
      }
    }

    return true;
  }

  /**
   * 查找wxpusher的用户id
   */
  async findUserWxpusherUid(userId: string): Promise<string | null> {
    const user = await this.adapter.model.findOne({ userId });
    if (!user) {
      return null;
    }

    const wxpusherUserId = user.wxpusherUserId;

    return wxpusherUserId;
  }

  /**
   * 发送消息
   */
  async sendMessage(userId: string, content: string) {
    const uid = await this.findUserWxpusherUid(userId);
    if (!uid) {
      console.warn('This user not bind wxpusher, skip!');
      return;
    }
    await got.post('https://wxpusher.zjiecode.com/api/send/message', {
      json: {
        appToken: this.appToken,
        content,
        contentType: 1, //内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
        uids: [uid],
      },
    });
  }
}

export default WxpusherService;
