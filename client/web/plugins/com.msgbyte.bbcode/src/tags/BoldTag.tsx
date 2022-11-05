import React from 'react';
import type { TagProps } from '../bbcode/type';

export const BoldTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');

  return <b>{text}</b>;
});
BoldTag.displayName = 'BoldTag';
