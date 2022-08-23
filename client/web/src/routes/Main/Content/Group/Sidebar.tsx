import React from 'react';
import { GroupPanelType, isValidStr, useGroupInfo } from 'tailchat-shared';
import { useParams } from 'react-router';
import { GroupHeader } from './GroupHeader';
import { GroupSection } from '@/components/GroupSection';
import { CommonSidebarWrapper } from '@/components/CommonSidebarWrapper';
import { SidebarItem } from './SidebarItem';

interface GroupParams {
  groupId: string;
}

/**
 * 群组面板侧边栏组件
 */
export const Sidebar: React.FC = React.memo(() => {
  const { groupId } = useParams<GroupParams>();
  const groupInfo = useGroupInfo(groupId);
  const groupPanels = groupInfo?.panels ?? [];

  return (
    <CommonSidebarWrapper data-tc-role="sidebar-group">
      <GroupHeader groupId={groupId} />

      <div className="p-2 space-y-1 overflow-auto">
        {groupPanels
          .filter((panel) => !isValidStr(panel.parentId))
          .map((panel) =>
            panel.type === GroupPanelType.GROUP ? (
              <GroupSection key={panel.id} header={panel.name}>
                {groupPanels
                  .filter((sub) => sub.parentId === panel.id)
                  .map((sub) => (
                    <SidebarItem key={sub.id} groupId={groupId} panel={sub} />
                  ))}
              </GroupSection>
            ) : (
              <SidebarItem key={panel.id} groupId={groupId} panel={panel} />
            )
          )}
      </div>
    </CommonSidebarWrapper>
  );
});
Sidebar.displayName = 'Sidebar';
