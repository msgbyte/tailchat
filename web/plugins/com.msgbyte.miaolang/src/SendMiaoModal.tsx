import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import {
  ModalWrapper,
  useModalContext,
  ChatInputActionContextProps,
} from '@capital/common';
import { Button, TextArea } from '@capital/component';
import { encode } from './trans';

interface SendMiaoModalProps {
  actions: ChatInputActionContextProps;
}
export const SendMiaoModal: React.FC<SendMiaoModalProps> = React.memo(
  (props) => {
    const [text, setText] = useState('');
    const modalContext = useModalContext();

    const handleSendMiao = useCallback(() => {
      const miao = encode(text);

      props.actions.sendMsg(miao);
      modalContext?.closeModal();
    }, [text, modalContext, props.actions]);

    return (
      <ModalWrapper title="喵言喵语">
        <TextArea
          placeholder="输入人话"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button
          style={{ marginTop: 8 }}
          type="primary"
          block={true}
          onClick={handleSendMiao}
        >
          发送喵语
        </Button>
      </ModalWrapper>
    );
  }
);
SendMiaoModal.displayName = 'SendMiaoModal';
