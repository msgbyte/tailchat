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
        name: 'com.msgbyte.webpanel',
        url: '/plugins/com.msgbyte.webpanel/index.js',
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
