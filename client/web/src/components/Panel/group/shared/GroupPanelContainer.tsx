import { IconBtn } from '@/components/IconBtn';
import React, { PropsWithChildren } from 'react';
import { t, useGroupPanelInfo } from 'tailchat-shared';
import {
  CommonPanelWrapper,
  CommonPanelWrapperProps,
} from '../../common/Wrapper';
import _isNil from 'lodash/isNil';
import { usePanelWindow } from '@/hooks/usePanelWindow';
import { OpenedPanelTip } from '@/components/OpenedPanelTip';

interface GroupPanelWithHeader extends PropsWithChildren {
  groupId: string;
  panelId: string;

  prefixActions?: CommonPanelWrapperProps['actions'];
  suffixActions?: CommonPanelWrapperProps['actions'];
}
export const GroupPanelContainer: React.FC<GroupPanelWithHeader> = React.memo(
  (props) => {
    const { groupId, panelId } = props;
    const panelInfo = useGroupPanelInfo(groupId, panelId);
    const { hasOpenedPanel, openPanelWindow, closePanelWindow } =
      usePanelWindow(`/panel/group/${groupId}/${panelId}`);

    if (_isNil(panelInfo)) {
      return null;
    }

    if (hasOpenedPanel) {
      return <OpenedPanelTip onClosePanelWindow={closePanelWindow} />;
    }

    return (
      <CommonPanelWrapper
        header={panelInfo.name}
        actions={(ctx) => [
          ...(props.prefixActions?.(ctx) ?? []),
          <IconBtn
            key="open"
            title={t('在新窗口打开')}
            shape="square"
            icon="mdi:dock-window"
            iconClassName="text-2xl"
            onClick={openPanelWindow}
          />,
          ...(props.suffixActions?.(ctx) ?? []),
        ]}
      >
        {props.children}
      </CommonPanelWrapper>
    );
  }
);
GroupPanelContainer.displayName = 'GroupPanelWithHeader';
