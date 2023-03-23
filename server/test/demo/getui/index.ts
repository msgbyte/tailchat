import * as dotenv from 'dotenv';
dotenv.config();
import { GetuiClient } from '../../../plugins/com.msgbyte.getui/lib/GetuiClient';

const client = new GetuiClient(
  process.env.GETUI_APPID,
  process.env.GETUI_APPKEY,
  process.env.GETUI_MASTERSECRET
);

client.allPush('title', 'body', {}).then((res) => {
  console.log('res', res);
});
