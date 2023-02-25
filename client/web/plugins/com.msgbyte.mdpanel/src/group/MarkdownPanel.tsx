import React from 'react';
import { GroupExtraDataPanel, Markdown, TextArea } from '@capital/component';
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

  .ant-input {
    flex: 1;
    resize: none;
  }
`;

const MarkdownPanel: React.FC = React.memo(() => {
  return (
    <GroupExtraDataPanel
      names={['markdown']}
      render={(info) => {
        return (
          <MainContent>
            <Markdown raw={info['markdown'] ?? ''} />
          </MainContent>
        );
      }}
      renderEdit={(dataMap: Record<string, string>) => {
        return (
          <EditModalContent>
            <div>{Translate.editTip}</div>

            <TextArea
              defaultValue={dataMap['markdown']}
              onChange={(e) => {
                dataMap['markdown'] = e.target.value;
              }}
            />
          </EditModalContent>
        );
      }}
    />
  );
});
MarkdownPanel.displayName = 'MarkdownPanel';

export default MarkdownPanel;
