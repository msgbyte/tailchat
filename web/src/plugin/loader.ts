import { initMiniStar, regDependency, regSharedModule } from 'mini-star';

/**
 * 初始化插件
 */
export function initPlugins(): Promise<void> {
  registerDependencies();
  registerModules();

  return initMiniStar({
    plugins: [
      {
        name: 'com.msgbyte.webview',
        url: '/plugins/com.msgbyte.webview/index.js',
      },
    ],
  });
}

function registerDependencies() {
  regDependency('react', () => import('react'));
}

function registerModules() {
  regSharedModule('@capital/common', () => import('./common/index'));
}
