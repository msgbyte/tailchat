import React, { useState } from 'react';
import { t, useGroupPanel } from 'tailchat-shared';
import { PanelCommonHeader } from '../common/Header';
import _isNil from 'lodash/isNil';
import { Icon } from '@iconify/react';
import { Button } from 'antd';
import { MembersPanel } from './MembersPanel';
import clsx from 'clsx';

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
    const [rightPanel, setRightPanel] =
      useState<{ name: string; panel: React.ReactNode }>();

    if (_isNil(panelInfo)) {
      return null;
    }

    return (
      <div className="w-full h-full flex">
        {/* 主面板 */}
        <div className="flex flex-col overflow-hidden flex-1">
          <PanelCommonHeader
            actions={[
              <Button
                key="members"
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
              />,
            ]}
          >
            {panelInfo.name}
          </PanelCommonHeader>
          <div className="flex-1 overflow-hidden">{props.children}</div>
        </div>

        {/* 右侧面板 */}
        <div
          className={clsx(
            'transition-all overflow-hidden border-l border-black border-opacity-20',
            {
              'w-96': rightPanel,
              'w-0': !rightPanel,
            }
          )}
        >
          <PanelCommonHeader
            actions={[
              <Button
                key="members"
                icon={<Icon className="anticon text-2xl" icon="mdi:close" />}
                onClick={() => setRightPanel(undefined)}
              />,
            ]}
          >
            {rightPanel?.name}
          </PanelCommonHeader>
          {rightPanel?.panel}
        </div>
      </div>
    );
  }
);
GroupPanelWrapper.displayName = 'GroupPanelWrapper';
