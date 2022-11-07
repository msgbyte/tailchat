import React from 'react';
import type { TagProps } from '../bbcode/type';

export const ItalicTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');

  return <i>{text}</i>;
});
ItalicTag.displayName = 'ItalicTag';
