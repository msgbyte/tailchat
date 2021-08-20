import React from 'react';
import { useGroupPanel } from 'tailchat-shared';
import { PanelCommonHeader } from '../common/Header';

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
    if (panelInfo === undefined) {
      return null;
    }

    return (
      <div className="w-full h-full flex flex-col overflow-hidden">
        <PanelCommonHeader>{panelInfo.name}</PanelCommonHeader>
        <div className="flex-1 overflow-hidden">{props.children}</div>
      </div>
    );
  }
);
GroupPanelWrapper.displayName = 'GroupPanelWrapper';
