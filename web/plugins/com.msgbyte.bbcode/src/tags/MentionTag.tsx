import React from 'react';
import type { TagProps } from '../bbcode/type';

export const MentionTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const userName = node.content.join('');
  const userId = node.attrs.at;

  return (
    <span className="plugin-bbcode-mention-tag" data-userid={userId}>
      @{userName}
    </span>
  );
});
MentionTag.displayName = 'MentionTag';
