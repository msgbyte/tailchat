import { regDependency, regSharedModule } from 'mini-star';
import { pluginManager } from './manager';

/**
 * 初始化插件
 */
export async function initPlugins(): Promise<void> {
  registerDependencies();
  registerModules();

  await pluginManager.initPlugins();
}

function registerDependencies() {
  regDependency('react', () => import('react'));
  regDependency('react-router', () => import('react-router'));
  regDependency('axios', () => import('axios')); // 用于插件的第三方包使用axios作为依赖的情况下，可以减少包体积
  regDependency('styled-components', () => import('styled-components')); // 仅用于第三方插件. tailchat本身更多使用 tailwindcss
  regDependency('zustand', () => import('zustand')); // 仅用于第三方插件. tailchat本身更多使用 tailwindcss
  regDependency(
    'zustand/middleware/immer',
    () => import('zustand/middleware/immer')
  ); // 仅用于第三方插件. tailchat本身更多使用 tailwindcss
}

function registerModules() {
  regSharedModule('@capital/common', () => import('./common/index'));
  regSharedModule('@capital/component', () => import('./component/index'));
}
