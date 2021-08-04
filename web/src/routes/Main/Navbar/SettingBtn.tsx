import { FullModal } from '@/components/FullModal';
import { closeModal, openModal } from '@/components/Modal';
import { Icon } from '@iconify/react';
import React, { useCallback } from 'react';

export const SettingBtn: React.FC = React.memo(() => {
  const handleClick = useCallback(() => {
    const key = openModal(
      <FullModal onChangeVisible={() => closeModal(key)}>
        Setting View
      </FullModal>
    );
  }, []);

  return (
    <Icon
      className="text-3xl text-white cursor-pointer"
      icon="mdi-dots-horizontal"
      onClick={handleClick}
    />
  );
});
SettingBtn.displayName = 'SettingBtn';
