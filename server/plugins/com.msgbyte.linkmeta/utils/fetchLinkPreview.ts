import { getLinkPreview } from 'link-preview-js';

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

  const promise = getLinkPreview(url);
  cacheRequestList[url] = promise;

  return Promise.resolve(promise).finally(() => {
    setTimeout(() => {
      delete cacheRequestList[url];
    }, 2 * 1000); // 窗口期, 请求完毕后2s内依旧会复用原来的接口
  });

  // return promise;
}
