import { FullModal } from '@/components/FullModal';
import { SidebarView, SidebarViewMenuType } from '@/components/SidebarView';
import React, { useCallback, useMemo } from 'react';
import { t } from 'tailchat-shared';
import { SettingsAbout } from './About';
import { SettingsAccount } from './Account';
import { SettingsStatus } from './Status';
import { SettingsSystem } from './System';

interface SettingsViewProps {
  onClose: () => void;
}
export const SettingsView: React.FC<SettingsViewProps> = React.memo((props) => {
  const handleChangeVisible = useCallback(
    (visible) => {
      if (visible === false && typeof props.onClose === 'function') {
        props.onClose();
      }
    },
    [props.onClose]
  );

  const menu: SidebarViewMenuType[] = useMemo(
    () => [
      {
        type: 'group',
        title: t('通用'),
        children: [
          {
            type: 'item',
            title: t('账户信息'),
            content: <SettingsAccount />,
          },
          {
            type: 'item',
            title: t('系统设置'),
            content: <SettingsSystem />,
          },
          {
            type: 'item',
            title: t('服务状态'),
            content: <SettingsStatus />,
          },
          {
            type: 'item',
            title: t('关于'),
            content: <SettingsAbout />,
          },
        ],
      },
    ],
    []
  );

  return (
    <FullModal onChangeVisible={handleChangeVisible}>
      <SidebarView menu={menu} defaultContentPath="0.children.0.content" />
    </FullModal>
  );
});
SettingsView.displayName = 'SettingsView';
