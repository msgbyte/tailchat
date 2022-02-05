import React from 'react';
import { t, useGroupPanel } from 'tailchat-shared';
import _isNil from 'lodash/isNil';
import { MembersPanel } from './MembersPanel';
import { CommonPanelWrapper } from '../common/Wrapper';
import { usePanelWindow } from '@/hooks/usePanelWindow';
import { OpenedPanelTip } from '@/components/OpenedPanelTip';
import { IconBtn } from '@/components/IconBtn';

/**
 * 群组面板通用包装器
 */
interface GroupPanelWrapperProps {
  groupId: string;
  panelId: string;

  /**
   * 是否显示面板头
   */
  showHeader: boolean;
}
export const GroupPanelWrapper: React.FC<GroupPanelWrapperProps> = React.memo(
  (props) => {
    const panelInfo = useGroupPanel(props.groupId, props.panelId);

    if (_isNil(panelInfo)) {
      return null;
    }

    const { hasOpenedPanel, openPanelWindow, closePanelWindow } =
      usePanelWindow(`/panel/group/${props.groupId}/${props.panelId}`);
    if (hasOpenedPanel) {
      return <OpenedPanelTip onClosePanelWindow={closePanelWindow} />;
    }

    if (!props.showHeader) {
      return <>{props.children}</>;
    }

    return (
      <CommonPanelWrapper
        header={panelInfo.name}
        actions={(setRightPanel) => [
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
    );
  }
);
GroupPanelWrapper.displayName = 'GroupPanelWrapper';
