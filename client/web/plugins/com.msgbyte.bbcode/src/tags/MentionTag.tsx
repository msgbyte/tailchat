import { UserName } from '@capital/component';
import React from 'react';
import type { TagProps } from '../bbcode/type';

export const MentionTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const fallbackName = node.content.join('');
  const userId = node.attrs.at;

  return (
    <span className="plugin-bbcode-mention-tag" data-userid={userId}>
      @{<UserName userId={userId} fallbackName={fallbackName} />}
    </span>
  );
});
MentionTag.displayName = 'MentionTag';
