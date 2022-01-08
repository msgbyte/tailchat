import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import {
  ModalWrapper,
  useModalContext,
  ChatInputActionContextProps,
} from '@capital/common';
import { Button, TextArea } from '@capital/component';
import { encode } from './miaotrans';
import { Translate } from './translate';

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
      <ModalWrapper title={Translate.title}>
        <TextArea
          placeholder={Translate.inputHuman}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button
          style={{ marginTop: 8 }}
          type="primary"
          block={true}
          onClick={handleSendMiao}
        >
          {Translate.send}
        </Button>
      </ModalWrapper>
    );
  }
);
SendMiaoModal.displayName = 'SendMiaoModal';
