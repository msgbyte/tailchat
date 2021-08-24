import { initMiniStar, regDependency, regSharedModule } from 'mini-star';
import { builtinPlugins } from './builtin';

/**
 * 初始化插件
 */
export function initPlugins(): Promise<void> {
  registerDependencies();
  registerModules();

  const plugins = builtinPlugins.map(({ name, url }) => ({
    name,
    url,
  }));

  return initMiniStar({
    plugins,
  });
}

function registerDependencies() {
  regDependency('react', () => import('react'));
}

function registerModules() {
  regSharedModule('@capital/common', () => import('./common/index'));
}
