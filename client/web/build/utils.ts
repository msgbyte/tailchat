import type { RuntimeCaching } from 'workbox-build';
/**
 * workbox 匹配plugin的缓存
 */
export const workboxPluginEntryPattern =
  /plugins\/com\.msgbyte(.*?)\/index\.js/;

export const workboxPluginDetailPattern =
  /plugins\/com\.msgbyte\.(.*?)\/(\S+?)\-(\S*?)\.js/;

export function buildRuntimePluginJSResourceCacheGroup(
  pattern: RegExp,
  name: string,
  expiration: number
): RuntimeCaching {
  return {
    urlPattern: pattern,
    // urlPattern: ({ url }) => {
    //   // 使用自定义匹配函数而不是直接传是为了方便解决跨域资源的service worker存储
    //   // 否则需要填入完整的前缀以解决跨域匹配(workbox对此进行了特殊的处理)
    //   return pattern.test(url.pathname);
    // },
    handler: 'StaleWhileRevalidate' as const,
    options: {
      cacheName: name,
      expiration: {
        maxAgeSeconds: expiration,
      },
      cacheableResponse: {
        // 只缓存js, 防止404后台直接fallback到html
        headers: {
          'content-type': 'application/javascript; charset=utf-8',
        },
      },
    },
  };
}
