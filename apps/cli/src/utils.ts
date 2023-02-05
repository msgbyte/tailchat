/**
 * 判断是否为开发环境
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * 增加github资源代理以优化国内访问速度
 */
export function withGhProxy(url: string): string {
  return `https://ghproxy.com/${url}`;
}
