import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { t, useGroupPanelInfo } from 'tailchat-shared';
import _isNil from 'lodash/isNil';
import { MembersPanel } from './MembersPanel';
import { CommonPanelWrapper } from '../common/Wrapper';
import { usePanelWindow } from '@/hooks/usePanelWindow';
import { OpenedPanelTip } from '@/components/OpenedPanelTip';
import { IconBtn } from '@/components/IconBtn';
import {
  GroupPluginPanelActionProps,
  pluginPanelActions,
} from '@/plugin/common';
import { useUserSessionPreference } from '@/hooks/useUserPreference';
import { GroupPanelContext } from '@/context/GroupPanelContext';

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

/**
 * 群组面板通用包装器
 */
interface GroupPanelWrapperProps extends PropsWithChildren {
  groupId: string;
  panelId: string;

  /**
   * 是否显示面板头
   */
  showHeader: boolean;
}
export const GroupPanelWrapper: React.FC<GroupPanelWrapperProps> = React.memo(
  (props) => {
    const panelInfo = useGroupPanelInfo(props.groupId, props.panelId);
    useRecordGroupPanel(props.groupId, props.panelId);

    const { hasOpenedPanel, openPanelWindow, closePanelWindow } =
      usePanelWindow(`/panel/group/${props.groupId}/${props.panelId}`);

    const groupPanelContextValue = useMemo(
      () => ({
        groupId: props.groupId,
        panelId: props.panelId,
      }),
      [props.groupId, props.panelId]
    );

    if (_isNil(panelInfo)) {
      return null;
    }

    if (hasOpenedPanel) {
      return <OpenedPanelTip onClosePanelWindow={closePanelWindow} />;
    }

    if (!props.showHeader) {
      return (
        <GroupPanelContext.Provider value={groupPanelContextValue}>
          {props.children}
        </GroupPanelContext.Provider>
      );
    }

    return (
      <GroupPanelContext.Provider value={groupPanelContextValue}>
        <CommonPanelWrapper
          header={panelInfo.name}
          actions={(setRightPanel) => [
            ...pluginPanelActions
              .filter(
                (action): action is GroupPluginPanelActionProps =>
                  action.position === 'group'
              )
              .map((action) => (
                <IconBtn
                  key={action.name}
                  title={action.label}
                  shape="square"
                  icon={action.icon}
                  iconClassName="text-2xl"
                  onClick={() =>
                    action.onClick({
                      groupId: props.groupId,
                      panelId: props.panelId,
                    })
                  }
                />
              )),
            <IconBtn
              key="open"
              title={t('在新窗口打开')}
              shape="square"
              icon="mdi:dock-window"
              iconClassName="text-2xl"
              onClick={openPanelWindow}
            />,
            <IconBtn
              key="members"
              title={t('成员列表')}
              shape="square"
              icon="mdi:account-supervisor-outline"
              iconClassName="text-2xl"
              onClick={() =>
                setRightPanel({
                  name: t('成员'),
                  panel: <MembersPanel groupId={props.groupId} />,
                })
              }
            />,
          ]}
        >
          {props.children}
        </CommonPanelWrapper>
      </GroupPanelContext.Provider>
    );
  }
);
GroupPanelWrapper.displayName = 'GroupPanelWrapper';
