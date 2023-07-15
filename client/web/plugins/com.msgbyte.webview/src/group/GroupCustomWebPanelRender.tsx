import React, { useEffect, useRef, useState } from 'react';
import { Translate } from '../translate';
import xss from 'xss';
import { useWatch } from '@capital/common';
import { GroupExtraDataPanel, TextArea } from '@capital/component';
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

const GroupCustomWebPanelRender: React.FC<{ html: string }> = (props) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const html = props.html;

  useEffect(() => {
    if (!ref.current || !html) {
      return;
    }

    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.writeln(getInjectedStyle(), xss(html));
    doc.close();
  }, [html]);

  if (!html) {
    return <div>{Translate.notfound}</div>;
  }

  return <iframe ref={ref} className="w-full h-full" />;
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
