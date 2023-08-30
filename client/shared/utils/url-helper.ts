import { getServiceUrl } from '../manager/service';

/**
 * 解析url, 将中间的常量替换成变量
 * @param originUrl 原始Url
 * @returns 解析后的url
 */
export function parseUrlStr(originUrl: string): string {
  return String(originUrl)
    .replace('{BACKEND}', getServiceUrl())
    .replace('%7BBACKEND%7D', getServiceUrl());
}
