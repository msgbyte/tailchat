import React, { useCallback, useMemo } from 'react';
import {
  GroupPanelType,
  useGroupInfo,
  GroupPanel as GroupPanelInfo,
} from 'tailchat-shared';
import { Tree } from 'antd';
import type { NodeDragEventParams } from 'rc-tree/lib/contextTypes';
import type { DataNode, EventDataNode } from 'antd/lib/tree';
import type { Key } from 'rc-tree/lib/interface';

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

export const GroupPanel: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const groupInfo = useGroupInfo(groupId);
  const groupPanels = groupInfo?.panels ?? [];

  const handleDrop = useCallback(
    (
      info: NodeDragEventParams & {
        dragNode: EventDataNode;
        dragNodesKeys: Key[];
        dropPosition: number;
        dropToGap: boolean;
      }
    ) => {
      // TODO
      console.log(info);
    },
    []
  );

  const treeData: DataNode[] = useMemo(
    () => buildTreeDataWithGroupPanel(groupPanels),
    [groupPanels]
  );

  return (
    <div>
      <Tree
        treeData={treeData}
        defaultExpandAll={true}
        draggable={true}
        onDrop={handleDrop}
      />
    </div>
  );
});
GroupPanel.displayName = 'GroupPanel';
