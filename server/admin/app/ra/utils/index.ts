/**
 * parse url, and replace some constants with variable
 * @param originUrl 原始Url
 * @returns 解析后的url
 */
export function parseUrlStr(originUrl: string): string {
  return String(originUrl).replace('{BACKEND}', window.location.origin);
}
