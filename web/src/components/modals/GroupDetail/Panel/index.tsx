import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  useGroupInfo,
  GroupPanel as GroupPanelInfo,
  t,
  modifyGroupField,
  useAsyncRequest,
  showToasts,
} from 'tailchat-shared';
import { Button } from 'antd';
import _isEqual from 'lodash/isEqual';
import { GroupPanelTree } from './GroupPanelTree';
import { FullModalCommonTitle } from '@/components/FullModal/CommonTitle';
import { closeModal, openModal } from '@/components/Modal';
import { ModalCreateGroupPanel } from '../../GroupPanel/CreateGroupPanel';

export const GroupPanel: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const groupInfo = useGroupInfo(groupId);
  const groupPanels = groupInfo?.panels ?? [];
  const [editingGroupPanels, setEditingGroupPanels] = useState(groupPanels);
  const isEditingRef = useRef(false);

  useEffect(() => {
    // 如果不处于编辑状态, 则一直更新最新的面板
    if (isEditingRef.current === true) {
      return;
    }

    setEditingGroupPanels(groupPanels);
  }, [groupPanels]);

  const handleChange = useCallback((newGroupPanels: GroupPanelInfo[]) => {
    isEditingRef.current = true;
    setEditingGroupPanels(newGroupPanels);
  }, []);

  const [{ loading }, handleSave] = useAsyncRequest(async () => {
    await modifyGroupField(groupId, 'panels', editingGroupPanels);
    isEditingRef.current = false;
    showToasts(t('保存成功'), 'success');
  }, [editingGroupPanels]);

  const handleReset = useCallback(() => {
    setEditingGroupPanels(groupPanels);
    isEditingRef.current = false;
  }, [groupPanels]);

  const handleOpenCreatePanelModal = useCallback(() => {
    const key = openModal(
      <ModalCreateGroupPanel
        groupId={groupId}
        onSuccess={() => {
          closeModal(key);
          isEditingRef.current = false;
        }}
      />
    );
  }, []);

  return (
    <div>
      <FullModalCommonTitle
        extra={
          <Button type="primary" onClick={handleOpenCreatePanelModal}>
            {t('创建面板')}
          </Button>
        }
      >
        {t('面板管理')}
      </FullModalCommonTitle>

      <GroupPanelTree
        groupId={groupId}
        groupPanels={editingGroupPanels}
        onChange={handleChange}
      />

      {!_isEqual(groupPanels, editingGroupPanels) && (
        <div className="space-x-1 mt-2">
          <Button type="primary" loading={loading} onClick={handleSave}>
            {t('保存')}
          </Button>
          <Button onClick={handleReset}>{t('重置')}</Button>
        </div>
      )}
    </div>
  );
});
GroupPanel.displayName = 'GroupPanel';
