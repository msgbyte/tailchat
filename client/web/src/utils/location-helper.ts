/**
 * 获取当前页面的search参数
 */
export function getSearchParam(param: string): string | null {
  return new URLSearchParams(window.location.search).get(param);
}
