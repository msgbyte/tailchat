export type OpenAppCapability = 'bot' | 'webpage' | 'oauth';

export interface OpenAppInfo {
  _id: string;
  owner: string;
  appId: string;
  appName: string;
  appDesc: string;
  appIcon: string;
  capability: OpenAppCapability[];
}
