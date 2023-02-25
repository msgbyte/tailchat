import { GroupPluginPanel } from '@/components/Panel/group/PluginPanel';
import { TextPanel } from '@/components/Panel/group/TextPanel';
import { Problem } from '@/components/Problem';
import { GroupPanelContext } from '@/context/GroupPanelContext';
import { useUserSessionPreference } from '@/hooks/useUserPreference';
import { Alert } from 'antd';
import React, { useEffect, useMemo } from 'react';
import {
  GroupInfoContextProvider,
  GroupPanelType,
  t,
  useGroupInfo,
  useGroupPanelInfo,
} from 'tailchat-shared';
import { useGroupPanelParams } from './utils';

/**
 * 记录下最后访问的面板id
 */
function useRecordGroupPanel(groupId: string, panelId: string) {
  const [lastVisitPanel, setLastVisitPanel] = useUserSessionPreference(
    'groupLastVisitPanel'
  );

  useEffect(() => {
    setLastVisitPanel({
      ...lastVisitPanel,
      [groupId]: panelId,
    });
  }, [groupId, panelId]);
}

interface GroupPanelRenderProps {
  groupId: string;
  panelId: string;
}
export const GroupPanelRender: React.FC<GroupPanelRenderProps> = React.memo(
  (props) => {
    const { groupId, panelId } = props;
    const groupInfo = useGroupInfo(groupId);
    const panelInfo = useGroupPanelInfo(groupId, panelId);
    const groupPanelContextValue = useMemo(
      () => ({
        groupId,
        panelId,
      }),
      [groupId, panelId]
    );
    useRecordGroupPanel(groupId, panelId);

    if (groupInfo === null) {
      return (
        <Alert
          className="w-full text-center"
          type="error"
          message={t('群组不存在')}
        />
      );
    }

    if (panelInfo === null) {
      return <Problem text={t('面板不存在')} />;
    }

    if (panelInfo.type === GroupPanelType.TEXT) {
      return (
        <GroupInfoContextProvider groupInfo={groupInfo}>
          <GroupPanelContext.Provider value={groupPanelContextValue}>
            <TextPanel groupId={groupId} panelId={panelInfo.id} />
          </GroupPanelContext.Provider>
        </GroupInfoContextProvider>
      );
    }
    if (panelInfo.type === GroupPanelType.PLUGIN) {
      return (
        <GroupPanelContext.Provider value={groupPanelContextValue}>
          <GroupPluginPanel groupId={groupId} panelId={panelInfo.id} />
        </GroupPanelContext.Provider>
      );
    }

    return (
      <Alert
        className="w-full text-center"
        type="error"
        message={t('未知的面板类型')}
      />
    );
  }
);
GroupPanelRender.displayName = 'GroupPanelRender';

export const GroupPanelRoute: React.FC = React.memo(() => {
  const { groupId, panelId } = useGroupPanelParams();

  return <GroupPanelRender groupId={groupId} panelId={panelId} />;
});
GroupPanelRoute.displayName = 'GroupPanelRoute';
