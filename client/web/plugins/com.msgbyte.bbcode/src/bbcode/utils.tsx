import type { AstNodeObj } from './type';

/**
 * 获取 url 节点的url地址
 * @param urlTag url节点
 */
export function getUrlTagRealUrl(urlTag: AstNodeObj): string {
  return urlTag.attrs.url ?? urlTag.content.join('');
}
