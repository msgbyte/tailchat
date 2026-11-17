import urlRegex from 'url-regex';

/**
 * 面板网址没有写协议但看起来是个域名时, 补上 https://
 */
export function normalizePanelUrl(url: string): string {
  if (
    !url.includes('://') &&
    urlRegex({ exact: true, strict: false }).test(url)
  ) {
    return 'https://' + url;
  }

  return url;
}
