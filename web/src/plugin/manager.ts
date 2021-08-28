import {
  getCachedRegistryPlugins,
  getStorage,
  PluginManifest,
} from 'tailchat-shared';
import { initMiniStar, loadSinglePlugin } from 'mini-star';
import _once from 'lodash/once';
import { builtinPlugins } from './builtin';

class PluginManager {
  /**
   * 存储插件列表的Key常量
   */
  static STORE_KEY = '$TailchatInstalledPlugins';

  /**
   * 初始化插件
   */
  initPlugins = _once(async () => {
    const installedPlugins = [
      ...builtinPlugins,
      ...(await this.getInstalledPlugins()),
    ];

    const plugins = installedPlugins.map(({ name, url }) => ({
      name,
      url,
    }));

    return initMiniStar({
      plugins,
    });
  });

  /**
   * 获取已安装插件列表(不包含强制安装的内部插件)
   */
  async getInstalledPlugins(): Promise<PluginManifest[]> {
    const plugins: PluginManifest[] = await getStorage().get(
      PluginManager.STORE_KEY,
      []
    );

    return plugins;
  }

  /**
   * 获取所有插件列表
   */
  async getRegistryPlugins(): Promise<PluginManifest[]> {
    return await getCachedRegistryPlugins();
  }

  /**
   * 安装插件
   */
  async installPlugin(manifest: PluginManifest) {
    const plugins = await this.getInstalledPlugins();

    const findedIndex = plugins.findIndex((p) => p.name === manifest.name);
    if (findedIndex >= 0) {
      // 已安装, 则更新
      plugins[findedIndex] = manifest;
    } else {
      // 未安装, 则推到最后
      plugins.push(manifest);
    }

    await getStorage().save(PluginManager.STORE_KEY, plugins);

    await loadSinglePlugin({
      name: manifest.name,
      url: manifest.url,
    });
  }
}

export const pluginManager = new PluginManager();
