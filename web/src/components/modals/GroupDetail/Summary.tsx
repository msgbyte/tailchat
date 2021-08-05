import React from 'react';

export const GroupSummary: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  return <div>GroupSummary: {props.groupId}</div>;
});
GroupSummary.displayName = 'GroupSummary';
