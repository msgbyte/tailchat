import React, { useCallback, useState } from 'react';
import { useGroupInfo, GroupPanel as GroupPanelInfo, t } from 'tailchat-shared';
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

  const handleSave = useCallback(() => {
    console.log('editingGroupPanels', editingGroupPanels);
  }, [editingGroupPanels]);

  return (
    <div>
      <GroupPanelTree
        groupPanels={editingGroupPanels}
        onChange={handleChange}
      />

      {!_isEqual(groupPanels, editingGroupPanels) && (
        <Button className="mt-2" onClick={handleSave}>
          {t('保存')}
        </Button>
      )}
    </div>
  );
});
GroupPanel.displayName = 'GroupPanel';
