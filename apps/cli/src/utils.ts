/**
 * Determine whether it is a development environment
 */
export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Add github resource proxy to optimize chinese access speed
 *
 * @deprecated this website is down
 */
export function withGhProxy(url: string): string {
  return `https://ghproxy.com/${url}`;
}
