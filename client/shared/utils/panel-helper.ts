import { GroupPanel, GroupPanelType } from '../model/group';

/**
 * 判断面板是否为会话面板
 *
 * 会话面板的属性是带有已读未读属性的(如默认的文本面板)
 */
export function isConversePanel(panel: GroupPanel) {
  // 目前只有文本面板

  if (panel.type === GroupPanelType.TEXT) {
    return true;
  }

  return false;
}
