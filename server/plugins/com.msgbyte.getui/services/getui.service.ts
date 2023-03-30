import { RequestError } from 'got';
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

    const { appId, appKey, masterSecert } = this.getuiInfo;
    const client = new GetuiClient(appId, appKey, masterSecert);

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
            await client.singlePush(userId, title, content, payload);
            await this.adapter.model.create({
              userId,
              title,
              content,
              payload,
              success: true,
            });
          } catch (err) {
            let errorMsg = String(err);

            if (err instanceof RequestError && err.response) {
              errorMsg = String(err.response.body);
            }
            await this.adapter.model.create({
              userId,
              title,
              content,
              payload,
              success: false,
              errorMsg,
            });
          }
        }
      }
    );
  }
}

export default GetuiService;
