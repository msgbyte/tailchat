import React, { useCallback, useState } from 'react';
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
import { openModal } from '@/components/Modal';
import { ModalCreateGroupPanel } from '../../CreateGroupPanel';

export const GroupPanel: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const groupInfo = useGroupInfo(groupId);
  const groupPanels = groupInfo?.panels ?? [];
  const [editingGroupPanels, setEditingGroupPanels] = useState(groupPanels);

  const handleChange = useCallback((newGroupPanels: GroupPanelInfo[]) => {
    setEditingGroupPanels(newGroupPanels);
  }, []);

  const [{ loading }, handleSave] = useAsyncRequest(async () => {
    await modifyGroupField(groupId, 'panels', editingGroupPanels);
    showToasts(t('保存成功'), 'success');
  }, [editingGroupPanels]);

  const [{ loading: createLoading }, handleCreatePanel] =
    useAsyncRequest(async () => {
      // TODO
    }, []);

  const handleOpenCreatePanelModal = useCallback(() => {
    openModal(<ModalCreateGroupPanel groupId={groupId} />);
  }, [handleCreatePanel]);

  return (
    <div>
      <FullModalCommonTitle
        extra={
          <Button
            type="primary"
            loading={createLoading}
            onClick={handleOpenCreatePanelModal}
          >
            {t('创建面板')}
          </Button>
        }
      >
        {t('面板管理')}
      </FullModalCommonTitle>

      <GroupPanelTree
        groupPanels={editingGroupPanels}
        onChange={handleChange}
      />

      {!_isEqual(groupPanels, editingGroupPanels) && (
        <Button className="mt-2" loading={loading} onClick={handleSave}>
          {t('保存')}
        </Button>
      )}
    </div>
  );
});
GroupPanel.displayName = 'GroupPanel';
