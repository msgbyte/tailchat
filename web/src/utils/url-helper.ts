import { stringify as urlSearchStringify, parse as urlSearchParse } from 'qs';

/**
 * 根据输入url返回绝对url
 * @param relativeUrl 相对或绝对url
 * @returns 绝对url
 */
export function markAbsoluteUrl(relativeUrl: string): string {
  return new URL(relativeUrl, location.href).href;
}

export { urlSearchStringify, urlSearchParse };

/**
 * 往当前的url search上追加
 */
export function appendUrlSearch(obj: Record<string, string>): string {
  return urlSearchStringify({
    ...urlSearchParse(window.location.search, { ignoreQueryPrefix: true }),
    ...obj,
  });
}
