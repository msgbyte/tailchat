import React from 'react';
import { t, useGroupPanel } from 'tailchat-shared';
import _isNil from 'lodash/isNil';
import { Icon } from '@iconify/react';
import { Button, Tooltip } from 'antd';
import { MembersPanel } from './MembersPanel';
import { CommonPanelWrapper } from '../common/Wrapper';

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

    return (
      <CommonPanelWrapper
        header={panelInfo.name}
        actions={(setRightPanel) => [
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
