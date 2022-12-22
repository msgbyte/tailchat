import { usePwa } from '@/hooks/usePwa';
import React from 'react';
import { Icon } from 'tailchat-design';

/**
 * 安装按钮
 */
export const InstallBtn: React.FC = React.memo(() => {
  const { canInstallprompt, showInstallPrompt } = usePwa();

  if (!canInstallprompt) {
    return null;
  }

  return (
    <Icon
      className="text-3xl text-gray-600 dark:text-white cursor-pointer"
      icon="mdi:download"
      onClick={showInstallPrompt}
    />
  );
});
InstallBtn.displayName = 'InstallBtn';
