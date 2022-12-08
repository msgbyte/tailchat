import { ModalWrapper, useModalContext } from '@/components/Modal';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { t } from 'tailchat-shared';

interface Props {
  groupId: string;
}
export const SuccessModal: React.FC<Props> = React.memo((props) => {
  const { closeModal } = useModalContext();
  const navigate = useNavigate();

  const handleNav = useCallback(() => {
    closeModal();
    navigate(`/main/group/${props.groupId}`);
  }, [closeModal, props.groupId]);

  return (
    <ModalWrapper title={t('加入群组成功!')}>
      <div>
        <Button block={true} type="primary" size="large" onClick={handleNav}>
          {t('跳转到群组')}
        </Button>
      </div>
    </ModalWrapper>
  );
});
SuccessModal.displayName = 'SuccessModal';
