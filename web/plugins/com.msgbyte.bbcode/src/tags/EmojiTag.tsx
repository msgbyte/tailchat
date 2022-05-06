import { Emoji } from '@capital/component';
import React from 'react';
import type { TagProps } from '../bbcode/type';

export const EmojiTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const code = node.content.join('');

  return <Emoji emoji={code} />;
});
EmojiTag.displayName = 'EmojiTag';
