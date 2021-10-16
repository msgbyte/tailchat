import React from 'react';
import { t, useGroupPanel } from 'tailchat-shared';
import _isNil from 'lodash/isNil';
import { Icon } from '@iconify/react';
import { Button, Tooltip } from 'antd';
import { MembersPanel } from './MembersPanel';
import { CommonPanelWrapper } from '../common/Wrapper';
import { usePanelWindow } from '@/hooks/usePanelWindow';
import { OpenedPanelTip } from '@/components/OpenedPanelTip';

/**
 * 群组面板通用包装器
 */
interface GroupPanelWrapperProps {
  groupId: string;
  panelId: string;
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

    return (
      <CommonPanelWrapper
        header={panelInfo.name}
        actions={(setRightPanel) => [
          <Tooltip key="open" title={t('在新窗口打开')}>
            <Button
              icon={
                <Icon className="anticon text-2xl" icon="mdi:dock-window" />
              }
              onClick={openPanelWindow}
            />
          </Tooltip>,
          <Tooltip key="members" title={t('成员列表')}>
            <Button
              icon={
                <Icon
                  className="anticon text-2xl"
                  icon="mdi:account-supervisor-outline"
                />
              }
              onClick={() =>
                setRightPanel({
                  name: t('成员'),
                  panel: <MembersPanel groupId={props.groupId} />,
                })
              }
            />
          </Tooltip>,
        ]}
      >
        {props.children}
      </CommonPanelWrapper>
    );
  }
);
GroupPanelWrapper.displayName = 'GroupPanelWrapper';
