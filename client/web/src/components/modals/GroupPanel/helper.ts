import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import { GroupPanel, GroupPanelType } from 'tailchat-shared';
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

/**
 * 从群组面板信息中获取面板属性修改相关信息
 */
export function pickValuesFromGroupPanelInfo(
  groupPanelInfo: GroupPanel
): GroupPanelValues {
  return {
    ...groupPanelInfo.meta,
    name: groupPanelInfo.name,
    type:
      groupPanelInfo.type === GroupPanelType.PLUGIN
        ? String(groupPanelInfo.pluginPanelName)
        : groupPanelInfo.type,
  };
}
