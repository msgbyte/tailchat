import { Link } from '@capital/component';
import React from 'react';
import styled from 'styled-components';
import type { TagProps } from '../bbcode/type';

const UnderlineSpan = styled.span`
  text-decoration: underline;
  text-decoration-style: dotted;
`;

export const UrlTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');
  const url = node.attrs.url ?? text;

  if (url.startsWith('/')) {
    // 内部地址，使用 react-router 进行导航
    return (
      <Link to={url} onContextMenu={(e) => e.stopPropagation()}>
        <UnderlineSpan>{text}</UnderlineSpan>
      </Link>
    );
  }

  if (url.startsWith(window.location.origin)) {
    // 内部地址，使用 react-router 进行导航
    return (
      <Link
        to={url.replace(window.location.origin, '')}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <UnderlineSpan>{text}</UnderlineSpan>
      </Link>
    );
  }

  return (
    <a
      href={url}
      title={text}
      target="_blank"
      rel="noopener noreferrer"
      onContextMenu={(e) => e.stopPropagation()}
    >
      <UnderlineSpan>{text}</UnderlineSpan>
    </a>
  );
});
UrlTag.displayName = 'UrlTag';
