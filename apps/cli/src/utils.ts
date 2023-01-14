/**
 * 判断是否为开发环境
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}
