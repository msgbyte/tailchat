import React, { useCallback, useMemo, useRef } from 'react';
import {
  GroupPanelType,
  GroupPanel as GroupPanelInfo,
  showToasts,
} from 'tailchat-shared';
import { Tree } from 'antd';
import type { NodeDragEventParams } from 'rc-tree/lib/contextTypes';
import type { DataNode, EventDataNode } from 'antd/lib/tree';
import type { Key } from 'rc-tree/lib/interface';
import type { AllowDrop } from 'rc-tree/lib/Tree';
import _cloneDeep from 'lodash/cloneDeep';
import _isNil from 'lodash/isNil';

/**
 * 将一维的面板列表构筑成立体的数组
 */
function buildTreeDataWithGroupPanel(
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
function rebuildGroupPanelOrder(
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

interface GroupPanelTree {
  groupPanels: GroupPanelInfo[];
  onChange: (newGroupPanels: GroupPanelInfo[]) => void;
}
/**
 * 仅同层级相互拉的树形结构
 */
export const GroupPanelTree: React.FC<GroupPanelTree> = React.memo((props) => {
  const draggingNode = useRef<DataNode | null>(null);
  const treeData: DataNode[] = useMemo(
    () => buildTreeDataWithGroupPanel(props.groupPanels),
    [props.groupPanels]
  );

  const handleDragStart = useCallback(
    (info: NodeDragEventParams<HTMLDivElement>) => {
      draggingNode.current = info.node;
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    draggingNode.current = null;
  }, []);

  const handleAllowDrop = useCallback(
    ({ dropNode, dropPosition }: Parameters<AllowDrop>[0]) => {
      if (draggingNode.current?.isLeaf === true) {
        // 如果正在拖拽的节点是面板
        if (dropPosition === 0) {
          return !dropNode.isLeaf;
        }
        return true;
      } else {
        // 正在拖拽的节点是分组
        if (dropPosition === 0) {
          // 不允许容器之间产生父子节点
          return false;
        }

        // 仅允许拖拽到分组的上下
        return !dropNode.isLeaf;
      }
    },
    []
  );

  const handleDrop = useCallback(
    (
      info: NodeDragEventParams & {
        dragNode: EventDataNode;
        dragNodesKeys: Key[];
        dropPosition: number;
        dropToGap: boolean;
      }
    ) => {
      const newGroupPanels = _cloneDeep(props.groupPanels);
      const dropNodePos = newGroupPanels.findIndex(
        (panel) => panel.id === info.node.key
      );
      const dropGroupPanel = newGroupPanels[dropNodePos];
      if (dropNodePos === -1) {
        showToasts('异常, 目标节点未找到', 'error');
      }

      const dragPanelPos = newGroupPanels.findIndex(
        (panel) => panel.id === info.dragNode.key
      );

      if (draggingNode.current?.isLeaf === true && info.node.isLeaf === true) {
        // 如果拖拽节点是面板且目标也是面板
        // 则更新它的父节点id为目标节点的父节点id
        info.dragNodesKeys
          // 获取所有的移动节点的位置
          .map((key) => newGroupPanels.findIndex((panel) => panel.id === key))
          // 过滤掉没找到的
          .filter((index) => index !== -1)
          .forEach((pos) => {
            newGroupPanels[pos].parentId = dropGroupPanel.parentId;
          });
      } else if (
        draggingNode.current?.isLeaf === true &&
        info.dropToGap === false &&
        info.node.isLeaf === false
      ) {
        // 拖拽节点是面板拖动到组节点上
        // 则更新它的父节点id为目标节点的id
        info.dragNodesKeys
          // 获取所有的移动节点的位置
          .map((key) => newGroupPanels.findIndex((panel) => panel.id === key))
          // 过滤掉没找到的
          .filter((index) => index !== -1)
          .forEach((pos) => {
            newGroupPanels[pos].parentId = dropGroupPanel.id;
          });
      }

      if (info.node.dragOverGapTop === true) {
        // 移动到目标节点之前
        newGroupPanels.splice(
          dropNodePos,
          0,
          newGroupPanels.splice(dragPanelPos, 1)[0]
        );
      } else if (info.node.dragOverGapBottom === true) {
        // 移动到目标节点之后
        newGroupPanels.splice(
          dragPanelPos,
          0,
          newGroupPanels.splice(dropNodePos, 1)[0]
        );
      }

      if (typeof props.onChange === 'function') {
        props.onChange(rebuildGroupPanelOrder(newGroupPanels));
      }
    },
    [props.groupPanels, props.onChange]
  );

  return (
    <Tree
      treeData={treeData}
      defaultExpandAll={true}
      draggable={true}
      onDrop={handleDrop}
      // TODO: 待简化 https://github.com/react-component/tree/pull/482
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      allowDrop={handleAllowDrop}
    />
  );
});
GroupPanelTree.displayName = 'GroupPanelTree';
