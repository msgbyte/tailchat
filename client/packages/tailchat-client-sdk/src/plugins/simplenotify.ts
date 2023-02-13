import axios from 'axios';

/**
 * 基于简易推送插件的消息通知服务
 *
 * @param hostUrl 实例地址url
 * @param subscribeId 订阅id
 * @param text 发送的文本，默认支持bbcode
 */
export async function sendSimpleNotify(
  hostUrl: string,
  subscribeId: string,
  text: string
) {
  await axios({
    method: 'post',
    baseURL: hostUrl,
    url: '/api/plugin:com.msgbyte.simplenotify/webhook/callback',
    data: {
      subscribeId,
      text,
    },
  });
}
