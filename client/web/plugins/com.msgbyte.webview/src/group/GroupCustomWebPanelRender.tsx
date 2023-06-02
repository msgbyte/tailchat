import React, { useEffect, useRef } from 'react';
import { Translate } from '../translate';

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
  const ref = useRef<HTMLIFrameElement>(null);
  const html = panelInfo?.meta?.html;

  useEffect(() => {
    if (!ref.current || !html) {
      return;
    }

    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.writeln(getInjectedStyle(), html);
    doc.close();
  }, [html]);

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  return <iframe ref={ref} className="w-full h-full" />;
};
GroupCustomWebPanelRender.displayName = 'GroupCustomWebPanelRender';

export default GroupCustomWebPanelRender;
