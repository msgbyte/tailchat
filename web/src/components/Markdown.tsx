import { markAbsoluteUrl } from '@/utils/url-helper';
import React, { useCallback } from 'react';
import { isValidStr } from 'tailchat-shared';
import { Loadable } from './Loadable';
import './Markdown.less';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ReactMarkdown = Loadable(() => import('react-markdown'));

export const Markdown: React.FC<{
  raw: string;
  baseUrl?: string;
}> = React.memo(({ raw, baseUrl }) => {
  const transformUrl = useCallback(
    (url: string) => {
      if (!isValidStr(baseUrl)) {
        return url;
      }

      return new URL(url, markAbsoluteUrl(baseUrl)).href;
    },
    [baseUrl]
  );

  return (
    <ReactMarkdown
      className="tailchat-markdown"
      transformImageUri={(src) => transformUrl(src)}
      transformLinkUri={(href) => transformUrl(href)}
    >
      {raw}
    </ReactMarkdown>
  );
});
Markdown.displayName = 'Markdown';
