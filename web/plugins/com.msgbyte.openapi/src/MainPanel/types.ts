const openAppCapability = [
  'bot', // 机器人
  'webpage', // 网页
  'oauth', // 第三方登录
] as const;

export type OpenAppCapability = typeof openAppCapability[number];

export interface OpenApp {
  _id: string;
  appId: string;
  appSecret: string;
  appName: string;
  appDesc: string;
  appIcon: string;
  capability: OpenAppCapability[];

  owner: string;
}
