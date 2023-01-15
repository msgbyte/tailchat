import React from 'react';
import { useGroupInfo } from 'tailchat-shared';

interface GroupNameProps {
  groupId: string;
  className?: string;
  style?: React.CSSProperties;
}

export const GroupName: React.FC<GroupNameProps> = React.memo((props) => {
  const { groupId, className, style } = props;
  const groupInfo = useGroupInfo(groupId);

  return (
    <span className={className} style={style}>
      {groupInfo?.name}
    </span>
  );
});
GroupName.displayName = 'GroupName';
