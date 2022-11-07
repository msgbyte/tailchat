import React from 'react';
import type { TagProps } from '../bbcode/type';

export const UnderlinedTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');

  return <ins>{text}</ins>;
});
UnderlinedTag.displayName = 'UnderlinedTag';
