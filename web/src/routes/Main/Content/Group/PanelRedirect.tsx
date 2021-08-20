import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { GroupPanelType, useGroupInfo } from 'tailchat-shared';
import _isNil from 'lodash/isNil';

export const GroupPanelRedirect: React.FC = React.memo(() => {
  const { groupId } = useParams<{
    groupId: string;
  }>();
  const history = useHistory();

  const groupInfo = useGroupInfo(groupId);
  useEffect(() => {
    if (!Array.isArray(groupInfo?.panels) || groupInfo?.panels.length === 0) {
      return;
    }

    const firstAvailablePanel = groupInfo?.panels.find(
      (panel) => panel.type !== GroupPanelType.GROUP
    );
    if (!_isNil(firstAvailablePanel)) {
      history.replace(`/main/group/${groupId}/${firstAvailablePanel.id}`);
    }
  }, [groupInfo]);

  return null;
});
GroupPanelRedirect.displayName = 'GroupPanelRedirect';
