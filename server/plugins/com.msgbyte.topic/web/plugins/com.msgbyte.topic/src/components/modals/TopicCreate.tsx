import { useAsyncRequest } from '@capital/common';
import { Button, ModalWrapper, TextArea } from '@capital/component';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Translate } from '../../translate';

const Footer = styled.div({
  textAlign: 'right',
  paddingTop: 10,
});

export const TopicCreate: React.FC<{
  onCreate: (text: string) => Promise<void>;
}> = React.memo((props) => {
  const [text, setText] = useState('');

  const [{ loading }, handleCreate] = useAsyncRequest(async () => {
    await props.onCreate(text);
  }, [text]);

  return (
    <ModalWrapper title={Translate.createBtn}>
      <TextArea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <Footer>
        <Button type="primary" loading={loading} onClick={handleCreate}>
          {Translate.createBtn}
        </Button>
      </Footer>
    </ModalWrapper>
  );
});
TopicCreate.displayName = 'TopicCreate';
