import React from 'react';
import {
  GroupPanel,
  GroupPanelType,
  isValidStr,
  useGroupInfo,
} from 'tailchat-shared';
import { useParams } from 'react-router';
import { GroupHeader } from './GroupHeader';
import { GroupSection } from '@/components/GroupSection';
import { GroupPanelItem } from '@/components/GroupPanelItem';
import { GroupTextPanelItem } from './TextPanelItem';

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

  const renderItem = (panel: GroupPanel) =>
    panel.type === GroupPanelType.TEXT ? (
      <GroupTextPanelItem groupId={groupId} panel={panel} />
    ) : (
      <GroupPanelItem
        name={panel.name}
        icon={<div>#</div>}
        to={`/main/group/${groupId}/${panel.id}`}
      />
    );

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
                    <div key={sub.id}>{renderItem(sub)}</div>
                  ))}
              </GroupSection>
            ) : (
              <div key={panel.id}>{renderItem(panel)}</div>
            )
          )}
      </div>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';
