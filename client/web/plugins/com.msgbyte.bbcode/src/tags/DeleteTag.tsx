import React from 'react';
import type { TagProps } from '../bbcode/type';

export const DeleteTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');

  return <del>{text}</del>;
});
DeleteTag.displayName = 'DeleteTag';
