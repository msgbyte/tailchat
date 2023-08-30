import { stringify as urlSearchStringify, parse as urlSearchParse } from 'qs';

/**
 * 根据输入url返回绝对url
 * @param relativeUrl 相对或绝对url
 * @returns 绝对url
 */
export function makeAbsoluteUrl(relativeUrl: string): string {
  return new URL(relativeUrl, location.href).href;
}

export { urlSearchStringify, urlSearchParse };

/**
 * 往当前的url search上追加
 */
export function appendUrlSearch(obj: Record<string, string>): string {
  return urlSearchStringify(
    {
      ...urlSearchParse(window.location.search, { ignoreQueryPrefix: true }),
      ...obj,
    },
    {
      skipNulls: true,
    }
  );
}

/**
 * 生成群组邀请码链接
 * @param inviteCode 邀请码
 */
export function generateInviteCodeUrl(inviteCode: string) {
  return `${location.origin}/invite/${inviteCode}`;
}
