import React, { useCallback, useMemo } from 'react';
import {
  deleteGroupPanel,
  GroupPanel as GroupPanelInfo,
  showAlert,
  t,
} from 'tailchat-shared';
import { Space, Tree } from 'antd';
import type { DataNode } from 'antd/lib/tree';
import { buildTreeDataWithGroupPanel } from './utils';
import { useGroupPanelTreeDrag } from './useGroupPanelTreeDrag';
import { closeModal, openModal } from '@/components/Modal';
import { ModalModifyGroupPanel } from '../../GroupPanel/ModifyGroupPanel';
import { IconBtn } from '@/components/IconBtn';

interface GroupPanelTree {
  groupId: string;
  groupPanels: GroupPanelInfo[];
  onChange: (newGroupPanels: GroupPanelInfo[]) => void;
}
/**
 * 仅同层级相互拉的树形结构
 */
export const GroupPanelTree: React.FC<GroupPanelTree> = React.memo((props) => {
  const treeData: DataNode[] = useMemo(
    () => buildTreeDataWithGroupPanel(props.groupPanels),
    [props.groupPanels]
  );

  const handleModifyPanel = useCallback(
    (panelId: string) => {
      const key = openModal(
        <ModalModifyGroupPanel
          groupId={props.groupId}
          groupPanelId={panelId}
          onSuccess={() => closeModal(key)}
        />
      );
    },
    [props.groupId]
  );

  const handleDeletePanel = useCallback(
    (panelId: string, panelName: string, isGroup: boolean) => {
      showAlert({
        message: isGroup
          ? t('确定要删除面板组 【{{name}}】 以及下级的所有面板么', {
              name: panelName,
            })
          : t('确定要删除面板 【{{name}}】 么', { name: panelName }),
        onConfirm: async () => {
          await deleteGroupPanel(props.groupId, panelId);
        },
      });
    },
    [props.groupId]
  );

  const titleRender = useCallback(
    (node: DataNode): React.ReactNode => {
      return (
        <div className="flex group">
          <span>{node.title}</span>
          <div className="opacity-0 group-hover:opacity-100 ml-2">
            <Space size="small">
              <IconBtn
                title={t('编辑')}
                type="text"
                size="small"
                icon="mdi:pencil-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleModifyPanel(String(node.key));
                }}
              />

              <IconBtn
                title={t('删除')}
                type="text"
                size="small"
                icon="mdi:trash-can-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDeletePanel(
                    String(node.key),
                    String(node.title),
                    !node.isLeaf
                  );
                }}
              />
            </Space>
          </div>
        </div>
      );
    },
    [handleDeletePanel]
  );

  const { handleDragStart, handleDragEnd, handleAllowDrop, handleDrop } =
    useGroupPanelTreeDrag(props.groupPanels, props.onChange);

  return (
    <Tree
      treeData={treeData}
      defaultExpandAll={true}
      blockNode={true}
      draggable={true}
      selectable={false}
      titleRender={titleRender}
      onDrop={handleDrop}
      // TODO: 待简化 https://github.com/react-component/tree/pull/482
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      allowDrop={handleAllowDrop}
    />
  );
});
GroupPanelTree.displayName = 'GroupPanelTree';
