import _isString from 'lodash/isString';
import str2int from 'str2int';
import urlRegex from 'url-regex';
import { config } from '../config';

/**
 * 判断一个字符串是否可用()
 * @param str 要判断的字符串
 */
export function isAvailableString(str: any): boolean {
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
 * 根据文本内容返回一个内置色卡的颜色
 * @param text 文本
 */
export function getTextColorHex(text: unknown): string {
  if (!text || !_isString(text)) {
    return '#ffffff'; // 如果获取不到文本，则返回白色
  }

  const color = config.color;
  const id = str2int(text);
  return color[id % color.length];
}

/**
 * 是否一个可用的字符串
 * 定义为有长度的字符串
 */
export function isValidStr(str: unknown): str is string {
  return typeof str == 'string' && str !== '';
}
