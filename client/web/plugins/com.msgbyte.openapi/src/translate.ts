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
  name: localTrans({
    'zh-CN': '名称',
    'en-US': 'Name',
  }),
  operation: localTrans({
    'zh-CN': '操作',
    'en-US': 'Operation',
  }),
  delete: localTrans({
    'zh-CN': '删除',
    'en-US': 'Delete',
  }),
  enter: localTrans({
    'zh-CN': '进入',
    'en-US': 'Enter',
  }),
  createApplication: localTrans({
    'zh-CN': '创建应用',
    'en-US': 'Create Application',
  }),
  createApplicationSuccess: localTrans({
    'zh-CN': '创建应用成功',
    'en-US': 'Create Application Success',
  }),
  appNameCannotBeEmpty: localTrans({
    'zh-CN': '应用名不能为空',
    'en-US': 'App Name Cannot be Empty',
  }),
  appNameTooLong: localTrans({
    'zh-CN': '应用名过长',
    'en-US': 'App Name too Long',
  }),
  app: {
    basicInfo: localTrans({
      'zh-CN': '基础信息',
      'en-US': 'Basic Info',
    }),
    bot: localTrans({
      'zh-CN': '机器人',
      'en-US': 'Bot',
    }),
    webpage: localTrans({
      'zh-CN': '网页',
      'en-US': 'Web Page',
    }),
    oauth: localTrans({
      'zh-CN': '第三方登录',
      'en-US': 'OAuth',
    }),
    appcret: localTrans({
      'zh-CN': '应用凭证',
      'en-US': 'Application Credentials',
    }),
    appName: localTrans({
      'zh-CN': '应用名称',
      'en-US': 'App Name',
    }),
    appDesc: localTrans({
      'zh-CN': '应用描述',
      'en-US': 'App Desc',
    }),
  },
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
  oauth: {
    open: localTrans({
      'zh-CN': '开启 OAuth',
      'en-US': 'Open OAuth',
    }),
    allowedCallbackUrls: localTrans({
      'zh-CN': '允许的回调地址',
      'en-US': 'Allowed Callback Urls',
    }),
    allowedCallbackUrlsTip: localTrans({
      'zh-CN': '多个回调地址单独一行',
      'en-US': 'Multiple callback addresses on a single line',
    }),
  },
};
