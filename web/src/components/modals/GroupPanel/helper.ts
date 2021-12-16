import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import { GroupPanelType } from 'tailchat-shared';
import type { GroupPanelValues } from './types';

/**
 * 根据表单数据生成需要提交的内容
 */
export function buildDataFromValues(values: GroupPanelValues) {
  const { name, type, ...meta } = values;
  let panelType: number;
  let provider: string | undefined = undefined;
  let pluginPanelName: string | undefined = undefined;

  if (typeof type === 'string') {
    // 创建一个来自插件的面板
    const panelName = type;
    panelType = GroupPanelType.PLUGIN;
    const pluginPanelInfo = findPluginPanelInfoByName(panelName);
    if (pluginPanelInfo) {
      provider = pluginPanelInfo.provider;
      pluginPanelName = pluginPanelInfo.name;
    }
  } else {
    panelType = type;
  }

  return {
    name,
    type: panelType,
    provider,
    pluginPanelName,
    meta,
  };
}
