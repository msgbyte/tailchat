import React, { useContext, useState, useCallback } from 'react';
import _noop from 'lodash/noop';

interface SidebarContextProps {
  showSidebar: boolean;
  switchSidebar: () => void;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
const SidebarContext = React.createContext<SidebarContextProps>({
  showSidebar: true,
  switchSidebar: _noop,
  setShowSidebar: _noop,
});
SidebarContext.displayName = 'SidebarContext';

export const SidebarContextProvider: React.FC = React.memo((props) => {
  const [showSidebar, setShowSidebar] = useState(true);

  // 切换
  const switchSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  }, [showSidebar]);

  return (
    <SidebarContext.Provider
      value={{ showSidebar, switchSidebar, setShowSidebar }}
    >
      {props.children}
    </SidebarContext.Provider>
  );
});
SidebarContextProvider.displayName = 'SidebarContextProvider';

export function useSidebarContext(): SidebarContextProps {
  const context = useContext(SidebarContext);

  return context;
}
