/**
 * 根据输入url返回绝对url
 * @param relativeUrl 相对或绝对url
 * @returns 绝对url
 */
export function markAbsoluteUrl(relativeUrl: string): string {
  return new URL(relativeUrl, location.href).href;
}
