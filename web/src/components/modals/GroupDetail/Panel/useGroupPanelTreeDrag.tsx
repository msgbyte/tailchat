import { useCallback, useRef } from 'react';
import { showToasts, t, GroupPanel as GroupPanelInfo } from 'tailchat-shared';
import type { NodeDragEventParams } from 'rc-tree/lib/contextTypes';
import type { DataNode, EventDataNode } from 'antd/lib/tree';
import type { Key } from 'rc-tree/lib/interface';
import type { AllowDrop } from 'rc-tree/lib/Tree';
import _cloneDeep from 'lodash/cloneDeep';
import { rebuildGroupPanelOrder } from './utils';

export function useGroupPanelTreeDrag(
  groupPanels: GroupPanelInfo[],
  onChangeGroupPanels: (newGroupPanels: GroupPanelInfo[]) => void
) {
  const draggingNode = useRef<DataNode | null>(null);

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
          return !dropNode.isLeaf; // 如果为分组则允许拖动
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
      const newGroupPanels = _cloneDeep(groupPanels);
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

      if (draggingNode.current?.isLeaf === true) {
        // 如果拖拽节点是面板且目标也是面板
        if (info.node.isLeaf === true) {
          // 如果目标也是面板
          // 则更新它的父节点id为目标节点的父节点id
          info.dragNodesKeys
            // 获取所有的移动节点的位置
            .map((key) => newGroupPanels.findIndex((panel) => panel.id === key))
            // 过滤掉没找到的
            .filter((index) => index !== -1)
            .forEach((pos) => {
              newGroupPanels[pos].parentId = dropGroupPanel.parentId;
            });
        } else if (info.dropToGap === false && info.node.isLeaf === false) {
          // 如果目标是组节点且拖动到内部
          // 则更新它的父节点id为目标节点的id
          info.dragNodesKeys
            // 获取所有的移动节点的位置
            .map((key) => newGroupPanels.findIndex((panel) => panel.id === key))
            // 过滤掉没找到的
            .filter((index) => index !== -1)
            .forEach((pos) => {
              newGroupPanels[pos].parentId = dropGroupPanel.id;
            });
        } else if (info.dropToGap === true && info.node.isLeaf === false) {
          // 如果目标是组节点但是拖动到兄弟节点
          // 则更新它的父节点id为空
          info.dragNodesKeys
            // 获取所有的移动节点的位置
            .map((key) => newGroupPanels.findIndex((panel) => panel.id === key))
            // 过滤掉没找到的
            .filter((index) => index !== -1)
            .forEach((pos) => {
              newGroupPanels[pos].parentId = undefined;
            });
        }
      }

      const fromPos = dragPanelPos;
      let toPos: number;
      if (info.node.dragOverGapTop === true) {
        // 移动到目标节点之前
        toPos = dropNodePos;
      } else {
        // 移动到目标节点之后或之内
        toPos = dropNodePos + 1;
      }

      // 应用移动, 先添加再删除
      if (fromPos < toPos) {
        // 如果是将数组中前面的数拿到后面
        newGroupPanels.splice(toPos, 0, newGroupPanels[fromPos]);
        newGroupPanels.splice(fromPos, 1);
      } else if (fromPos > toPos) {
        // 把后面的数拿到前面
        const [tmp] = newGroupPanels.splice(fromPos, 1);
        newGroupPanels.splice(toPos, 0, tmp);
      }

      if (typeof onChangeGroupPanels === 'function') {
        const res = rebuildGroupPanelOrder(newGroupPanels);
        onChangeGroupPanels(res);
      }
    },
    [groupPanels, onChangeGroupPanels]
  );

  return {
    handleDragStart,
    handleDragEnd,
    handleAllowDrop,
    handleDrop,
  };
}
