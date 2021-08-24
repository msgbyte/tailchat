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

export const PluginStore: React.FC = React.memo(() => {
  const { loading, value: installedPluginList = [] } = useAsync(
    async () => pluginManager.getInstalledPlugins(),
    []
  );

  if (loading) {
    return <LoadingSpinner tip={t('正在加载已安装插件')} />;
  }

  const installedPluginNameList = installedPluginList.map((p) => p.name);

  return (
    <div className="p-2 w-full">
      <PillTabs>
        <PillTabPane key="1" tab={t('全部')}>
          <Divider orientation="left">{t('内置插件')}</Divider>

          <div className="flex flex-wrap">
            {builtinPlugins.map((plugin) => (
              <div key={plugin.name} className="m-1">
                <PluginStoreItem
                  manifest={plugin}
                  installed={installedPluginNameList.includes(plugin.name)}
                  builtin={true}
                />
              </div>
            ))}
          </div>

          <Divider orientation="left">{t('插件中心')}</Divider>

          {/* TODO: 插件中心 */}
        </PillTabPane>

        <PillTabPane key="2" tab={t('已安装')}>
          <Divider orientation="left">{t('已安装')}</Divider>

          <div className="flex flex-wrap">
            {[...builtinPlugins, ...installedPluginList].map((plugin) => (
              <PluginStoreItem
                key={plugin.name}
                manifest={plugin}
                installed={true}
                builtin={true}
              />
            ))}
          </div>
        </PillTabPane>
      </PillTabs>
    </div>
  );
});
PluginStore.displayName = 'PluginStore';
