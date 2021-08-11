import React from 'react';
import { GroupPanelType, useGroupInfo } from 'tailchat-shared';
import { useParams } from 'react-router';
import { GroupHeader } from './GroupHeader';
import { GroupSection } from '@/components/GroupSection';
import { GroupPanelItem } from '@/components/GroupPanelItem';

interface GroupParams {
  groupId: string;
}

/**
 * 个人面板侧边栏组件
 */
export const Sidebar: React.FC = React.memo(() => {
  const { groupId } = useParams<GroupParams>();
  const groupInfo = useGroupInfo(groupId);
  const groupPanels = groupInfo?.panels ?? [];

  return (
    <div>
      <GroupHeader groupId={groupId} />

      <div className="p-2">
        {groupPanels
          .filter((panel) => panel.type === GroupPanelType.GROUP)
          .map((group) => (
            <GroupSection key={group.id} header={group.name}>
              {groupPanels
                .filter((panel) => panel.parentId === group.id)
                .map((panel) => (
                  <div key={panel.id}>
                    <GroupPanelItem
                      name={panel.name}
                      icon={<div>#</div>}
                      to={`/main/group/${groupId}/${panel.id}`}
                    />
                  </div>
                ))}
            </GroupSection>
          ))}
      </div>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';
