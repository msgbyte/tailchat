import _isString from 'lodash/isString';
import urlRegex from 'url-regex';

/**
 * 判断一个字符串是否可用()
 * @param str 要判断的字符串
 */
export function isAvailableString(str: unknown): boolean {
  return typeof str === 'string' && str.length > 0;
}

/**
 * 判断一个字符串是否是url
 * @param str 要判断的字符串
 */
export function isUrl(str: string) {
  return urlRegex({ exact: true }).test(str);
}

/**
 * 判断字符串是否是一个blobUrl
 * @param str url字符串
 */
export const isBlobUrl = (str: string) => {
  return _isString(str) && str.startsWith('blob:');
};

/**
 * 获取一段字符串中的所有url
 * @param str 字符串
 */
export const getUrls = (str: string): string[] => {
  return str.match(urlRegex()) ?? [];
};

/**
 * 用于判定环境变量的值
 */
export function is(it: string) {
  return !!it && it !== '0' && it !== 'false';
}

/**
 * 是否一个可用的字符串
 * 定义为有长度的字符串
 */
export function isValidStr(str: unknown): str is string {
  return typeof str == 'string' && str !== '';
}

export function isLocalMessageId(str: unknown): str is string {
  if (typeof str !== 'string') {
    return false;
  }

  return str.startsWith('localMessage_');
}
