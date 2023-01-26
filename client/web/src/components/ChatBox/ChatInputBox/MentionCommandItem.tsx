import React from 'react';
import { Icon } from 'tailchat-design';

/**
 * 提及命令列表项
 */
export const MentionCommandItem: React.FC<{
  icon: string;
  label: string;
}> = React.memo((props) => {
  return (
    <div className="flex items-center py-2 px-3">
      <Icon className="mr-1 text-lg" icon={props.icon} />

      <div>{props.label}</div>
    </div>
  );
});
MentionCommandItem.displayName = 'MentionCommandItem';
