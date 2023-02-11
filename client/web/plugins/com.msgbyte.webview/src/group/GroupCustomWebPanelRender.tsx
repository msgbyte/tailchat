import React, { useMemo } from 'react';
import { isValidStr } from '@capital/common';
import { Translate } from '../translate';
import { sanitize } from 'script_sanitize';
import { WebviewKeepAlive } from '@capital/component';

function getInjectedStyle() {
  try {
    // 当前面板文本颜色
    const currentTextColor = document.defaultView.getComputedStyle(
      document.querySelector('.tc-content-background')
    ).color;

    return `<style>body { color: ${currentTextColor} }</style>`;
  } catch (e) {
    return '';
  }
}

const cacheMap = new Map<string, string>();

function createInlineUrl(html: string): string | undefined {
  if (cacheMap.has(html)) {
    return cacheMap.get(html);
  }

  if (isValidStr(html)) {
    const appendHtml = getInjectedStyle(); // 额外追加的样式
    try {
      const blob = new Blob(
        [
          sanitize(html + appendHtml, {
            replacementText: 'No allowed script',
          }),
        ],
        {
          type: 'text/html',
        }
      );

      const url = window.URL.createObjectURL(blob);
      cacheMap.set(html, url);
      return url;
    } catch (e) {
      return undefined;
    }
  } else {
    return undefined;
  }
}

const GroupCustomWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  const html = panelInfo?.meta?.html;
  const url = useMemo(() => {
    return createInlineUrl(html);
  }, [html]);

  return <WebviewKeepAlive className="w-full h-full" url={url} />;
};
GroupCustomWebPanelRender.displayName = 'GroupCustomWebPanelRender';

export default GroupCustomWebPanelRender;
