import React from 'react';
import { Markdown } from '@capital/component';
import type { TagProps } from '../bbcode/type';

export const MarkdownTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');

  return <Markdown raw={text} />;
});
MarkdownTag.displayName = 'MarkdownTag';
