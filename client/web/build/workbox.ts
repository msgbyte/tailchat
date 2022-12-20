import { workboxPluginDetailPattern, workboxPluginEntryPattern } from './utils';
import WorkboxPlugin from 'workbox-webpack-plugin';

/**
 * 构建webpack workbox sw插件
 */
export function buildWorkboxPlugin(isDev: boolean) {
  const workboxPlugin = new WorkboxPlugin.GenerateSW({
    // https://developers.google.com/web/tools/workbox
    // these options encourage the ServiceWorkers to get in there fast
    // and not allow any straggling "old" SWs to hang around
    clientsClaim: true,
    skipWaiting: true,

    exclude: isDev
      ? // https://github.com/GoogleChrome/workbox/issues/1790#issuecomment-1241356293
        // In dev, exclude everything.
        // This avoids irrelevant warnings about chunks being too large for caching.
        // In non-dev, use the default `exclude` option, don't override.
        [/./]
      : // Do not precache images in production
        [/\.(?:png|jpg|jpeg|svg)$/],

    maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 限制最大缓存 8M

    // Define runtime caching rules.
    runtimeCaching: [
      {
        // Match any request that ends with .png, .jpg, .jpeg or .svg.
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

        // Apply a cache-first strategy.
        // Reference: https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies
        handler: 'CacheFirst',

        options: {
          // Use a custom cache name.
          cacheName: 'images',

          // Only cache 10 images.
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 14 * 24 * 60 * 60, // 2 week
          },
        },
      },
      //#region 插件缓存匹配
      {
        // 匹配内置 plugins 入口文件 以加速
        urlPattern: workboxPluginEntryPattern,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'builtin-plugins-entry',
          expiration: {
            maxAgeSeconds: 24 * 60 * 60, // 1 day
          },
          cacheableResponse: {
            // 只缓存js, 防止404后台直接fallback到html
            headers: {
              'content-type': 'application/javascript; charset=utf-8',
            },
          },
        },
      },
      {
        // 匹配内置 plugins 内容 以加速
        urlPattern: workboxPluginDetailPattern,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'builtin-plugins-detail',
          expiration: {
            maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
          },
          cacheableResponse: {
            // 只缓存js, 防止404后台直接fallback到html
            headers: {
              'content-type': 'application/javascript; charset=utf-8',
            },
          },
        },
      },
      //#endregion
    ],
  });

  if (isDev) {
    // Suppress the "InjectManifest has been called multiple times" warning by reaching into
    // the private properties of the plugin and making sure it never ends up in the state
    // where it makes that warning.
    // https://github.com/GoogleChrome/workbox/blob/v6/packages/workbox-webpack-plugin/src/inject-manifest.ts#L260-L282
    Object.defineProperty(workboxPlugin, 'alreadyCalled', {
      get() {
        return false;
      },
      set() {
        // do nothing; the internals try to set it to true, which then results in a warning
        // on the next run of webpack.
      },
    });
  }

  return workboxPlugin;
}
