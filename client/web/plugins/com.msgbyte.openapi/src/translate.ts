import { localTrans } from '@capital/common';

export const Translate = {
  openapi: localTrans({ 'zh-CN': '开放平台', 'en-US': 'Open Api' }),
  noservice: localTrans({
    'zh-CN': '管理员没有开放 Openapi 服务',
    'en-US': 'The administrator did not open the Openapi service',
  }),
  enableBotCapability: localTrans({
    'zh-CN': '开启机器人能力',
    'en-US': 'Enable Bot Capability',
  }),
  bot: {
    callback: localTrans({
      'zh-CN': '消息回调地址',
      'en-US': 'Callback Url',
    }),
    callbackTip: localTrans({
      'zh-CN':
        '机器人被 @ 的时候会向该地址发送请求(收件箱接受到新内容时会发送回调)',
      'en-US':
        'The bot will send a request to this address when it is mentioned (callback will be sent when the inbox receives new content)',
    }),
  },
};
