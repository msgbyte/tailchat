import React, { useState } from 'react';
import { Translate } from '../translate';
import { FilterXSS, getDefaultWhiteList } from 'xss';
import { useWatch } from '@capital/common';
import { GroupExtraDataPanel, NoData, TextArea } from '@capital/component';
import styled from 'styled-components';

const EditModalContent = styled.div`
  padding: 10px;
  width: 80vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .main {
    flex: 1;
    overflow: hidden;

    > textarea {
      height: 100%;
      resize: none;
    }
  }
`;

export const xss = new FilterXSS({
  css: false,
  whiteList: {
    ...getDefaultWhiteList(),
    iframe: ['src', 'style', 'class'],
    // 允许完整的 html 文档结构, 但属性同样走白名单, 不能放行 onload 等事件属性
    html: [],
    head: [],
    body: ['style', 'class'],
    meta: ['charset'],
    style: [],
  },
});

function getInjectedStyle() {
  try {
    // 当前面板文本颜色
    const currentTextColor = window.getComputedStyle(
      document.querySelector('.tc-content-background')!
    ).color;

    return `<style>body { color: ${currentTextColor} }</style>`;
  } catch (e) {
    return '';
  }
}

export const GroupCustomWebPanelRender: React.FC<{ html: string }> = (
  props
) => {
  const html = props.html;

  if (!html) {
    return <NoData />;
  }

  // 不给 allow-same-origin: 即使过滤被绕过, 内容也运行在独立源中, 无法读取主站的登录凭据
  return (
    <iframe
      className="w-full h-full"
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
      srcDoc={getInjectedStyle() + xss.process(html)}
    />
  );
};
GroupCustomWebPanelRender.displayName = 'GroupCustomWebPanelRender';

const GroupCustomWebPanelEditor: React.FC<{
  initValue: string;
  onChange: (html: string) => void;
}> = React.memo((props) => {
  const [html, setHtml] = useState(() => props.initValue ?? '');

  useWatch([html], () => {
    props.onChange(html);
  });

  return <TextArea value={html} onChange={(e) => setHtml(e.target.value)} />;
});
GroupCustomWebPanelEditor.displayName = 'GroupCustomWebPanelEditor';

const GroupCustomWebPanel: React.FC<{ panelInfo: any }> = (props) => {
  return (
    <GroupExtraDataPanel
      names={['html']}
      render={(dataMap: Record<string, string>) => {
        return (
          <GroupCustomWebPanelRender
            html={dataMap['html'] ?? props.panelInfo?.meta?.html ?? ''}
          />
        );
      }}
      renderEdit={(dataMap: Record<string, string>) => {
        return (
          <EditModalContent>
            <div>{Translate.editTip}</div>

            <div className="main">
              <GroupCustomWebPanelEditor
                initValue={dataMap['html'] ?? props.panelInfo?.meta?.html ?? ''}
                onChange={(html) => (dataMap['html'] = html)}
              />
            </div>
          </EditModalContent>
        );
      }}
    />
  );
};
GroupCustomWebPanel.displayName = 'GroupCustomWebPanel';

export default GroupCustomWebPanel;
