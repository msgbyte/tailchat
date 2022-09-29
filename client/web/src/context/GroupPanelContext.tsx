import React, { useContext } from 'react';

interface GroupPanelContextValue {
  groupId: string;
  panelId: string;
}
export const GroupPanelContext =
  React.createContext<GroupPanelContextValue | null>(null);
GroupPanelContext.displayName = 'GroupPanelContext';

/**
 * 获取群组面板的上下文
 */
export function useGroupPanelContext(): GroupPanelContextValue | null {
  return useContext(GroupPanelContext);
}
