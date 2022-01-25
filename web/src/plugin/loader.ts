import { regDependency, regSharedModule } from 'mini-star';
import { pluginManager } from './manager';

/**
 * 初始化插件
 */
export function initPlugins(): Promise<void> {
  registerDependencies();
  registerModules();

  return pluginManager.initPlugins();
}

function registerDependencies() {
  regDependency('react', () => import('react'));
  regDependency('axios', () => import('axios')); // 用于插件的第三方包使用axios作为依赖的情况下，可以减少包体积
}

function registerModules() {
  regSharedModule('@capital/common', () => import('./common/index'));
  regSharedModule('@capital/component', () => import('./component/index'));
}
