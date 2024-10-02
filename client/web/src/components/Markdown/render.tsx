import { makeAbsoluteUrl } from '@/utils/url-helper';
import React, { useCallback, useMemo } from 'react';
import { isValidStr, parseUrlStr, useTranslation } from 'tailchat-shared';
import { Loadable } from '../Loadable';
import { Image } from 'tailchat-design';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import './render.less';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const ReactMarkdown = Loadable(() => import('react-markdown'));

export const Markdown: React.FC<{
  raw: string;
  baseUrl?: string;
}> = React.memo(({ raw, baseUrl }) => {
  const { t } = useTranslation();
  const transformUrl = useCallback(
    (url: string) => {
      url = parseUrlStr(url);
      if (!isValidStr(baseUrl)) {
        return url;
      }

      return new URL(url, makeAbsoluteUrl(baseUrl)).href;
    },
    [baseUrl]
  );

  /**
   * Markdown自定义渲染组件
   */
  const components = useMemo<
    React.ComponentProps<typeof ReactMarkdown>['components']
  >(
    () => ({
      img: (props) => (
        <Image
          style={props.style}
          width={props.width}
          height={props.height}
          src={props.src}
          preview={true}
        />
      ),
      style: () => <div>{t('不支持自定义样式')}</div>,
      meta: () => <div>{t('不支持自定义Meta')}</div>,
    }),
    []
  );

  return (
    <ReactMarkdown
      className="tailchat-markdown"
      transformImageUri={(src) => transformUrl(src)}
      transformLinkUri={(href) => transformUrl(href)}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      linkTarget="_blank"
      skipHtml={true}
      components={components}
    >
      {raw}
    </ReactMarkdown>
  );
});
Markdown.displayName = 'Markdown';
