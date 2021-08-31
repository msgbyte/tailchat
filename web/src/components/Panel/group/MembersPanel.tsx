import { UserListItem } from '@/components/UserListItem';
import React from 'react';
import { useGroupInfo } from '../../../../../shared';

interface MembersPanelProps {
  groupId: string;
}

/**
 * 用户面板
 */
export const MembersPanel: React.FC<MembersPanelProps> = React.memo((props) => {
  const groupInfo = useGroupInfo(props.groupId);
  const members = groupInfo?.members ?? [];

  return (
    <div>
      {members.map((member) => (
        <UserListItem key={member.userId} userId={member.userId} />
      ))}
    </div>
  );
});
MembersPanel.displayName = 'MembersPanel';
