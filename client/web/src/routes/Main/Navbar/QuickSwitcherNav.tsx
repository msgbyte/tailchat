import React from 'react';
import { NavbarNavItem } from './NavItem';
import { t } from 'tailchat-shared';
import { Icon } from 'tailchat-design';
import { openQuickSwitcher } from '@/components/QuickSwitcher';

export const QuickSwitcherNav: React.FC = React.memo(() => {
  return (
    <NavbarNavItem
      className="bg-gray-700"
      name={t('快速搜索、跳转') + ' | ctrl + k'}
      onClick={() => {
        openQuickSwitcher();
      }}
      data-testid="search"
    >
      <Icon className="text-3xl text-white" icon="mdi:search" />
    </NavbarNavItem>
  );
});
QuickSwitcherNav.displayName = 'QuickSwitcherNav';
