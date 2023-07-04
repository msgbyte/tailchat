export function urlResolve(base: string, url: string): string {
  return new URL(url, base).href;
}
