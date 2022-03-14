import React, { useCallback } from 'react';
import { isValidStr } from 'tailchat-shared';

const ReactMarkdown = React.lazy(() => import('react-markdown'));

export const Markdown: React.FC<{
  raw: string;
  baseUrl?: string;
}> = React.memo(({ raw, baseUrl }) => {
  const transformUrl = useCallback(
    (url: string) => {
      if (!isValidStr(baseUrl)) {
        return url;
      }

      return new URL(url, baseUrl).href;
    },
    [baseUrl]
  );

  return (
    <ReactMarkdown
      transformImageUri={(src) => transformUrl(src)}
      transformLinkUri={(href) => transformUrl(href)}
    >
      {raw}
    </ReactMarkdown>
  );
});
Markdown.displayName = 'Markdown';
