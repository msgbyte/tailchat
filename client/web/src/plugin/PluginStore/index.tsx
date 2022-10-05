/**
 * 插件商店
 */

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PillTabPane, PillTabs } from '@/components/PillTabs';
import { Divider } from 'antd';
import React from 'react';
import { t, useAsync } from 'tailchat-shared';
import { builtinPlugins } from '../builtin';
import { pluginManager } from '../manager';
import { PluginStoreItem } from './Item';
import { ManualInstall } from './ManualInstall';

function usePluginStoreData() {
  const { loading: loading1, value: installedPluginList = [] } = useAsync(
    async () => pluginManager.getInstalledPlugins(),
    []
  );
  const { loading: loading2, value: allPlugins = [] } = useAsync(
    async () => pluginManager.getRegistryPlugins(),
    []
  );

  const loading = loading1 || loading2;

  return {
    loading,
    installedPluginList,
    allPlugins,
  };
}

export const PluginStore: React.FC = React.memo(() => {
  const { loading, installedPluginList, allPlugins } = usePluginStoreData();

  if (loading) {
    return <LoadingSpinner tip={t('正在加载插件列表')} />;
  }

  const installedPluginNameList = installedPluginList.map((p) => p.name);
  const builtinPluginNameList = builtinPlugins.map((p) => p.name);

  return (
    <div className="p-2 w-full">
      <PillTabs>
        <PillTabPane key="1" tab={t('已安装')}>
          <Divider orientation="left">{t('已安装')}</Divider>

          <div className="flex flex-wrap">
            {[...builtinPlugins, ...installedPluginList].map((plugin) => (
              <PluginStoreItem
                key={plugin.name}
                manifest={plugin}
                installed={true}
                builtin={builtinPluginNameList.includes(plugin.name)}
              />
            ))}
          </div>
        </PillTabPane>

        <PillTabPane key="2" tab={t('全部')}>
          <Divider orientation="left">{t('内置插件')}</Divider>

          <div className="flex flex-wrap">
            {builtinPlugins.map((plugin) => (
              <PluginStoreItem
                key={plugin.name}
                manifest={plugin}
                installed={installedPluginNameList.includes(plugin.name)}
                builtin={true}
              />
            ))}
          </div>

          <Divider orientation="left">{t('插件中心')}</Divider>

          <div className="flex flex-wrap">
            {allPlugins.map((plugin) => (
              <PluginStoreItem
                key={plugin.name}
                manifest={plugin}
                installed={installedPluginNameList.includes(plugin.name)}
              />
            ))}
          </div>
        </PillTabPane>

        <PillTabPane
          tab={<span className="text-green-400">{t('手动安装')}</span>}
          key="3"
        >
          <ManualInstall />
        </PillTabPane>
      </PillTabs>
    </div>
  );
});
PluginStore.displayName = 'PluginStore';
