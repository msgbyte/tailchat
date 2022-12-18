import React, { useMemo } from 'react';
import { encode } from 'js-base64';
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

const GroupCustomWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  const html = panelInfo?.meta?.html;
  const url = useMemo(() => {
    if (isValidStr(html)) {
      const appendHtml = getInjectedStyle(); // 额外追加的样式
      try {
        return `data:text/html;charset=utf8;base64,${encode(
          sanitize(html + appendHtml, { replacementText: 'No allowed script' })
        )}`;
      } catch (e) {
        return undefined;
      }
    } else {
      return undefined;
    }
  }, [html]);

  return <WebviewKeepAlive className="w-full h-full" url={url} />;
};
GroupCustomWebPanelRender.displayName = 'GroupCustomWebPanelRender';

export default GroupCustomWebPanelRender;
