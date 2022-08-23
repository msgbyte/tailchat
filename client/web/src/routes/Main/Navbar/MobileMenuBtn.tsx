import { useIsMobile } from '@/hooks/useIsMobile';
import { Icon } from '@/components/Icon';
import React, { useCallback } from 'react';
import { useSidebarContext } from '../SidebarContext';

export const MobileMenuBtn: React.FC = React.memo(() => {
  const { showSidebar, setShowSidebar } = useSidebarContext();
  const isMobile = useIsMobile();

  const handleSwitchSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  }, [showSidebar]);

  if (!isMobile) {
    return null;
  }

  return (
    <Icon
      className="text-5xl mb-4 cursor-pointer"
      icon={showSidebar ? 'mdi:menu-open' : 'mdi:menu'}
      onClick={handleSwitchSidebar}
    />
  );
});
MobileMenuBtn.displayName = 'MobileMenuBtn';
