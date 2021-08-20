import React from 'react';
import { GroupPanelType, isValidStr, useGroupInfo } from 'tailchat-shared';
import { useParams } from 'react-router';
import { GroupHeader } from './GroupHeader';
import { GroupSection } from '@/components/GroupSection';
import { GroupPanelItem } from '@/components/GroupPanelItem';

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
    <div>
      <GroupHeader groupId={groupId} />

      <div className="p-2 space-y-1">
        {groupPanels
          .filter((panel) => !isValidStr(panel.parentId))
          .map((panel) =>
            panel.type === GroupPanelType.GROUP ? (
              <GroupSection key={panel.id} header={panel.name}>
                {groupPanels
                  .filter((sub) => sub.parentId === panel.id)
                  .map((sub) => (
                    <div key={sub.id}>
                      <GroupPanelItem
                        name={sub.name}
                        icon={<div>#</div>}
                        to={`/main/group/${groupId}/${sub.id}`}
                      />
                    </div>
                  ))}
              </GroupSection>
            ) : (
              <GroupPanelItem
                key={panel.id}
                name={panel.name}
                icon={<div>#</div>}
                to={`/main/group/${groupId}/${panel.id}`}
              />
            )
          )}
      </div>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';
