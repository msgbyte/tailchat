import React from 'react';
import type { TagProps } from '../bbcode/type';

export const UrlTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');
  const url = node.attrs.url ?? text;

  return (
    <a href={url} title={text} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );
});
UrlTag.displayName = 'UrlTag';
