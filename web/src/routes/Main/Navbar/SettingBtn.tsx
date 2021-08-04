import { closeModal, openModal } from '@/components/Modal';
import { SettingsView } from '@/components/modals/SettingsView';
import { Icon } from '@iconify/react';
import React, { useCallback } from 'react';

export const SettingBtn: React.FC = React.memo(() => {
  const handleClick = useCallback(() => {
    const key = openModal(<SettingsView onClose={() => closeModal(key)} />);
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
