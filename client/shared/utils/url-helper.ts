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

/**
 * 判断 url 能否安全地用于链接跳转、iframe 等场景
 * 只允许 http(s) 和相对地址, 拒绝 javascript: data: 等会执行代码的协议
 */
export function isSafeUrl(url: string): boolean {
  // 与浏览器解析 url 一致: 忽略开头的空白/控制字符, 以及任意位置的 tab 和换行
  const normalized = String(url)
    .replace(/[\t\n\r]/g, '')
    .replace(/^[\x00-\x20]+/, '');
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(normalized)?.[1].toLowerCase();

  return scheme === undefined || scheme === 'http' || scheme === 'https';
}
