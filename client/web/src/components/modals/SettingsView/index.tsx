import { FullModal } from '@/components/FullModal';
import {
  SidebarView,
  SidebarViewMenuItem,
  SidebarViewMenuType,
} from '@/components/SidebarView';
import { pluginCustomPanel } from '@/plugin/common';
import React, { useCallback, useMemo } from 'react';
import { isDevelopment, t } from 'tailchat-shared';
import { SettingsAbout } from './About';
import { SettingsAccount } from './Account';
import { SettingsDebug } from './Debug';
import { SettingsPerformance } from './Performance';
import { SettingsStatus } from './Status';
import { SettingsSystem } from './System';

interface SettingsViewProps {
  onClose: () => void;
}
export const SettingsView: React.FC<SettingsViewProps> = React.memo((props) => {
  const handleChangeVisible = useCallback(
    (visible: boolean) => {
      if (visible === false && typeof props.onClose === 'function') {
        props.onClose();
      }
    },
    [props.onClose]
  );

  const menu: SidebarViewMenuType[] = useMemo(() => {
    const common: SidebarViewMenuType = {
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
          title: t('性能统计'),
          content: <SettingsPerformance />,
        },
        {
          type: 'item',
          title: t('关于'),
          content: <SettingsAbout />,
        },
      ],
    };
    if (isDevelopment) {
      // 仅用于开发环境
      common.children.push({
        type: 'item',
        title: t('调试'),
        content: <SettingsDebug />,
      });
    }

    const more: SidebarViewMenuItem[] = pluginCustomPanel
      .filter((p) => p.position === 'setting')
      .map((p) => ({
        type: 'item',
        title: p.label,
        content: React.createElement(p.render),
      }));

    const menu: SidebarViewMenuType[] = [common];
    if (more.length > 0) {
      menu.push({
        type: 'group',
        title: t('更多'),
        children: [...more],
      });
    }

    return menu;
  }, []);

  return (
    <FullModal onChangeVisible={handleChangeVisible}>
      <SidebarView menu={menu} defaultContentPath="0.children.0.content" />
    </FullModal>
  );
});
SettingsView.displayName = 'SettingsView';
