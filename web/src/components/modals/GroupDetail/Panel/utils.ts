import _isNil from 'lodash/isNil';
import { GroupPanelType, GroupPanel as GroupPanelInfo } from 'tailchat-shared';
import type { DataNode } from 'antd/lib/tree';
import _cloneDeep from 'lodash/cloneDeep';

/**
 * 将一维的面板列表构筑成立体的数组
 */
export function buildTreeDataWithGroupPanel(
  groupPanels: GroupPanelInfo[]
): DataNode[] {
  return groupPanels
    .filter((panel) => panel.type === GroupPanelType.GROUP)
    .map<DataNode>((section) => ({
      key: section.id,
      title: section.name,
      isLeaf: false,
      children: groupPanels
        .filter((panel) => panel.parentId === section.id)
        .map<DataNode>((panel) => ({
          key: panel.id,
          title: panel.name,
          isLeaf: true,
        })),
    }));
}

/**
 * 重新构建面板顺序
 */
export function rebuildGroupPanelOrder(
  groupPanels: GroupPanelInfo[]
): GroupPanelInfo[] {
  const originGroupPanels = _cloneDeep(groupPanels);
  const newPanel = originGroupPanels.filter((panel) => _isNil(panel.parentId)); // 第一层
  const len = newPanel.length;
  for (let i = len - 1; i >= 0; i--) {
    const currentId = newPanel[i].id;
    newPanel.splice(
      i + 1,
      0,
      ...originGroupPanels.filter((p) => p.parentId === currentId)
    );
  }

  return newPanel;
}
