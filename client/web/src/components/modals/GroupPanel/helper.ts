import { findPluginPanelInfoByName } from '@/utils/plugin-helper';
import {
  getGroupPanelSlowMode,
  GroupPanel,
  GroupPanelType,
} from 'tailchat-shared';
import type { GroupPanelValues } from './types';
import _omit from 'lodash/omit';

/**
 * 根据表单数据生成需要提交的内容
 */
export function buildDataFromValues(values: GroupPanelValues) {
  const { name, type, permissionMap, fallbackPermissions, ...meta } = values;
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

  const cleanedMeta = _omit(meta, ['slowMode']);
  const slowMode =
    panelType === GroupPanelType.TEXT ? getGroupPanelSlowMode(meta) : undefined;

  return {
    name,
    type: panelType,
    provider,
    pluginPanelName,
    meta: slowMode ? { ...cleanedMeta, slowMode } : cleanedMeta,
    permissionMap,
    fallbackPermissions,
  };
}

/**
 * 从群组面板信息中获取面板属性修改相关信息
 */
export function pickValuesFromGroupPanelInfo(
  groupPanelInfo: GroupPanel | null
): GroupPanelValues {
  if (groupPanelInfo === null) {
    return {
      name: '',
      type: GroupPanelType.TEXT,
      slowMode: undefined,
    };
  }

  return {
    ...groupPanelInfo.meta,
    name: groupPanelInfo.name,
    type:
      groupPanelInfo.type === GroupPanelType.PLUGIN
        ? String(groupPanelInfo.pluginPanelName)
        : groupPanelInfo.type,
    slowMode: getGroupPanelSlowMode(groupPanelInfo.meta),
    permissionMap: groupPanelInfo.permissionMap,
    fallbackPermissions: groupPanelInfo.fallbackPermissions,
  };
}
