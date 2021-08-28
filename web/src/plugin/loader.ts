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
}

function registerModules() {
  regSharedModule('@capital/common', () => import('./common/index'));
}
