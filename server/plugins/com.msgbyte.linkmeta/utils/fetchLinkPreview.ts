import { getLinkPreview } from 'link-preview-js';
import { resolvePublicAddress } from '../../../lib/safeRequest';

/**
 * 请求管理
 */
const cacheRequestList: Record<string, Promise<any>> = {};

/**
 * 获取网页元数据信息
 * @param url 网址
 * @returns
 */
export async function fetchLinkPreview(url: string): Promise<any> {
  if (cacheRequestList[url]) {
    // 如果有正在请求的信息
    return Promise.resolve(cacheRequestList[url]);
  }

  const promise = getLinkPreview(url, {
    // 域名指向内网时拒绝请求. link-preview-js 默认不跟随重定向
    // ponytail: 校验与实际请求是两次解析, DNS 重绑定仍可能绕过, 需要彻底杜绝时改为自行用 got + safeGotOptions 抓取后交给 getPreviewFromContent
    resolveDNSHost: (detectedUrl) =>
      resolvePublicAddress(new URL(detectedUrl).hostname),
  });
  cacheRequestList[url] = promise;

  return Promise.resolve(promise).finally(() => {
    setTimeout(() => {
      delete cacheRequestList[url];
    }, 2 * 1000); // 窗口期, 请求完毕后2s内依旧会复用原来的接口
  });

  // return promise;
}
