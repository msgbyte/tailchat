import { Link } from '@capital/component';
import React from 'react';
import type { TagProps } from '../bbcode/type';

export const UrlTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');
  const url = node.attrs.url ?? text;

  if (url.startsWith('/') || url.startsWith(window.location.origin)) {
    // 内部地址，使用 react-router 进行导航
    return <Link to={url}>{text}</Link>;
  }

  return (
    <a href={url} title={text} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );
});
UrlTag.displayName = 'UrlTag';
