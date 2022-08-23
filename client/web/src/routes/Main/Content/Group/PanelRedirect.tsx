import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { GroupPanelType, useGroupInfo, useUpdateRef } from 'tailchat-shared';
import _isNil from 'lodash/isNil';
import { useUserSessionPreference } from '@/hooks/useUserPreference';

export const GroupPanelRedirect: React.FC = React.memo(() => {
  const { groupId } = useParams<{
    groupId: string;
  }>();
  const history = useHistory();
  const [lastVisitPanel] = useUserSessionPreference('groupLastVisitPanel');
  const lastVisitPanelRef = useUpdateRef(lastVisitPanel);

  const groupInfo = useGroupInfo(groupId);
  useEffect(() => {
    if (!groupInfo) {
      return;
    }

    if (!Array.isArray(groupInfo?.panels) || groupInfo?.panels.length === 0) {
      return;
    }

    const lastVisitPanelId = lastVisitPanelRef.current?.[groupInfo._id]; // 用户上一次访问
    const panels = groupInfo.panels;

    /**
     * 首先找之前有没有打开过面板的记录
     * 如果有则打开面板
     * 否则则找到第一个非group的面板
     */
    const panelExist = panels.some((p) => p.id === lastVisitPanelId);
    if (panelExist) {
      history.replace(`/main/group/${groupId}/${lastVisitPanelId}`);
      return;
    }

    const firstAvailablePanel = panels.find(
      (panel) => panel.type !== GroupPanelType.GROUP
    );
    if (!_isNil(firstAvailablePanel)) {
      history.replace(`/main/group/${groupId}/${firstAvailablePanel.id}`);
    }
  }, [groupInfo]);

  return null;
});
GroupPanelRedirect.displayName = 'GroupPanelRedirect';
