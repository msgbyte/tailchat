import React, { useEffect, useState } from 'react';
import {
  GroupExtraDataPanel,
  Markdown,
  MarkdownEditor,
} from '@capital/component';
import styled from 'styled-components';
import { Translate } from '../translate';

const MainContent = styled.div`
  padding: 10px;
`;

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

    > div {
      height: 100%;

      > .bytemd {
        height: 100%;
      }
    }
  }
`;

const MarkdownEditorRender: React.FC<{ dataMap: Record<string, string> }> =
  React.memo((props) => {
    const [text, setText] = useState(() => props.dataMap['markdown']);

    useEffect(() => {
      props.dataMap['markdown'] = text;
    }, [text]);

    return (
      <MarkdownEditor value={text} onChange={(val: string) => setText(val)} />
    );
  });
MarkdownEditorRender.displayName = 'MarkdownEditorRender';

const MarkdownPanel: React.FC = React.memo(() => {
  return (
    <GroupExtraDataPanel
      names={['markdown']}
      render={(dataMap: Record<string, string>) => {
        return (
          <MainContent>
            <Markdown raw={dataMap['markdown'] ?? ''} />
          </MainContent>
        );
      }}
      renderEdit={(dataMap: Record<string, string>) => {
        return (
          <EditModalContent>
            <div>{Translate.editTip}</div>

            <div className="main">
              <MarkdownEditorRender dataMap={dataMap} />
            </div>
          </EditModalContent>
        );
      }}
    />
  );
});
MarkdownPanel.displayName = 'MarkdownPanel';

export default MarkdownPanel;
