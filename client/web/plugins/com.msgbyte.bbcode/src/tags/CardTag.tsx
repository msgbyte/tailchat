import { Card } from '@capital/component';
import React from 'react';
import type { TagProps } from '../bbcode/type';

export const CardTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const label = node.content.join('');
  const attrs = node.attrs ?? {};

  const payload: any = {
    label,
    ...attrs,
  };

  return <Card type={payload.type} payload={payload} />;
});
CardTag.displayName = 'CardTag';
