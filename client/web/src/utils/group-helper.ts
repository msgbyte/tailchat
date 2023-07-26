import { GroupPanel, GroupPanelType } from 'tailchat-shared';
import { findPluginPanelInfoByName } from './plugin-helper';

/**
 * 检查是否具有已读未读功能的群组面板
 */
export function isGroupAckPanel(panel: GroupPanel) {
  if (panel.type === GroupPanelType.TEXT) {
    return true;
  }

  if (panel.type === GroupPanelType.PLUGIN) {
    const pluginPanelInfo = findPluginPanelInfoByName(panel.name);
    return pluginPanelInfo?.feature?.includes('ack') ?? false;
  }

  return false;
}
