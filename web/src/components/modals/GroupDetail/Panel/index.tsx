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

  return (
    <div>
      <div className="text-xl font-bold mb-4">{t('面板管理')}</div>

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
