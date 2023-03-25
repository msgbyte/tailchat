import { TcService, TcDbService, InboxStruct, call } from 'tailchat-server-sdk';
import { GetuiClient } from '../lib/GetuiClient';
import type { GetuiLogDocument, GetuiLogModel } from '../models/log';

/**
 * Support Getui Notify in chinese mainland
 */
interface GetuiService
  extends TcService,
    TcDbService<GetuiLogDocument, GetuiLogModel> {}
class GetuiService extends TcService {
  client: GetuiClient = null;

  get serviceName() {
    return 'plugin:com.msgbyte.getui';
  }

  get getuiInfo() {
    return {
      appId: process.env.GETUI_APPID,
      appKey: process.env.GETUI_APPKEY,
      masterSecert: process.env.GETUI_MASTERSECRET,
    };
  }

  get getuiAvailable(): boolean {
    const { appId, appKey, masterSecert } = this.getuiInfo;
    if (appId && appKey && masterSecert) {
      return true;
    }

    return false;
  }

  onInit() {
    if (!this.getuiAvailable) {
      console.warn(
        '[plugin:com.msgbyte.getui] require env: GETUI_APPID, GETUI_APPKEY, GETUI_MASTERSECRET'
      );
      return;
    }

    this.initClient();

    this.registerLocalDb(require('../models/log').default);
    this.registerEventListener(
      'chat.inbox.append',
      async (inboxItem: InboxStruct, ctx) => {
        if (inboxItem.type === 'message') {
          const userId = inboxItem.userId;
          const message = inboxItem.message;

          let title = 'new';
          if (message.groupId) {
            const groupInfo = await call(ctx).getGroupInfo(message.groupId);
            title = groupInfo.name;
          }
          const content = message.messageSnippet;
          const payload = {
            converseId: message.converseId,
            groupId: message.groupId,
          };

          try {
            await this.client.singlePush(userId, title, content, payload);
            await this.adapter.model.create({
              userId,
              title,
              content,
              payload,
              success: true,
            });
          } catch (err) {
            await this.adapter.model.create({
              userId,
              title,
              content,
              payload,
              success: false,
              errorMsg: String(err),
            });
          }
        }
      }
    );
  }

  initClient() {
    const { appId, appKey, masterSecert } = this.getuiInfo;
    this.client = new GetuiClient(appId, appKey, masterSecert);
  }
}

export default GetuiService;
