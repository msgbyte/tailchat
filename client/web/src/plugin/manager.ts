import {
  getCachedRegistryPlugins,
  getStorage,
  PluginManifest,
} from 'tailchat-shared';
import { initMiniStar, loadSinglePlugin } from 'mini-star';
import _once from 'lodash/once';
import { builtinPlugins } from './builtin';
import { showPluginLoadError } from './showPluginLoadError';

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

    const loadErrorPlugins = new Set<string>();
    await initMiniStar({
      plugins,
      onPluginLoadError: (err) => {
        console.error('Plugin load error:', err);
        loadErrorPlugins.add(err.pluginName);
      },
    });

    if (loadErrorPlugins.size > 0) {
      showPluginLoadError(Array.from(loadErrorPlugins));
    }
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
  getRegistryPlugins = _once(async (): Promise<PluginManifest[]> => {
    const plugins = await getCachedRegistryPlugins();

    this.updatePluginsInfo(plugins);

    return plugins;
  });

  /**
   * 自动更新插件信息到最新版本
   */
  private async updatePluginsInfo(plugins: PluginManifest[]) {
    const installPlugins = await this.getInstalledPlugins();

    await this.saveInstalledPlugins(
      installPlugins.map((item) => {
        const latestPluginInfo = plugins.find((p) => p.name === item.name);
        if (latestPluginInfo) {
          return {
            ...item,
            ...latestPluginInfo,
          };
        } else {
          return item;
        }
      })
    );
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

    await this.saveInstalledPlugins(plugins);

    await loadSinglePlugin({
      name: manifest.name,
      url: manifest.url,
    });
  }

  /**
   * 卸载插件
   */
  async uninstallPlugin(pluginName: string) {
    const plugins: PluginManifest[] = await getStorage().get(
      PluginManager.STORE_KEY
    );
    const index = plugins.findIndex((plugin) => plugin.name === pluginName);
    if (index >= 0) {
      plugins.splice(index, 1);
      await this.saveInstalledPlugins(plugins);
    }
  }

  /**
   * 记录已安装插件信息
   */
  private async saveInstalledPlugins(plugins: PluginManifest[]) {
    await getStorage().save(PluginManager.STORE_KEY, plugins);
  }
}

export const pluginManager = new PluginManager();
