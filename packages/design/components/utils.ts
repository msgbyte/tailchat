/**
 * 是否一个可用的字符串
 * 定义为有长度的字符串
 */
export function isValidStr(str: unknown): str is string {
  return typeof str == 'string' && str !== '';
}
