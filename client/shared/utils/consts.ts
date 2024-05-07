import type { GlobalConfig } from '../model/config';

/**
 * 昵称合法性匹配
 * 最大八个汉字内容或者16字英文
 * 且中间不能有空格
 */
export const NAME_REGEXP =
  /^([0-9a-zA-Z]{1,2}|[\u4e00-\u9eff]|[\u3040-\u309Fー]|[\u30A0-\u30FF]){1,8}$/;

/**
 * 系统语言的常量
 */
export const LANGUAGE_KEY = 'i18n:language';

/**
 * 系统用户id
 */
export const SYSTEM_USERID = '000000000000000000000000';

export const defaultGlobalConfig: GlobalConfig = {
  tianji: {},
  uploadFileLimit: 1 * 1024 * 1024,
  emailVerification: false,
  serverName: 'Tailchat',
  disableUserRegister: false,
  disableGuestLogin: false,
  disableCreateGroup: false,
  disablePluginStore: false,
  disableAddFriend: false,
  disableTelemetry: false,
  announcement: false,
};
