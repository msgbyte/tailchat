import React from 'react';
import { t } from 'tailchat-shared';
import { ModalWrapper } from '../Modal';

export const ModalCreateGroupPanel: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  return (
    <ModalWrapper title={t('创建群组面板')}>
      创建群组面板: {props.groupId}
    </ModalWrapper>
  );
});
ModalCreateGroupPanel.displayName = 'ModalCreateGroupPanel';
