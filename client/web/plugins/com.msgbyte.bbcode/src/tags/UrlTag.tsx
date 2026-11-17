import { isSafeUrl } from '@capital/common';
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

  if (!isSafeUrl(url)) {
    // javascript: 等地址不渲染成链接
    return <span>{text}</span>;
  }

  // 内部地址，使用 react-router 进行导航
  // 必须是单个 / 开头的路径: //host 和 /\host 会被浏览器当成外部地址
  const path = url.startsWith(window.location.origin)
    ? url.slice(window.location.origin.length)
    : url;
  if (/^\/(?![/\\])/.test(path)) {
    return (
      <Link to={path} onContextMenu={(e) => e.stopPropagation()}>
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
