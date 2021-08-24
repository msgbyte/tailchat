/**
 * 插件商店
 */

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Divider } from 'antd';
import React from 'react';
import { t, useAsync } from 'tailchat-shared';
import { builtinPlugins } from '../builtin';
import { pluginManager } from '../manager';
import { PluginStoreItem } from './Item';

export const PluginStore: React.FC = React.memo(() => {
  const { loading, value: installedPluginNameList = [] } =
    useAsync(async () => {
      const plugins = await pluginManager.getInstalledPlugins();
      return plugins.map((p) => p.name);
    }, []);

  if (loading) {
    return <LoadingSpinner tip={t('正在加载已安装插件')} />;
  }

  return (
    <div className="p-2 w-full">
      {/* 内置插件 */}
      <Divider orientation="left">{t('内置插件')}</Divider>

      <div>
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
    </div>
  );
});
PluginStore.displayName = 'PluginStore';
