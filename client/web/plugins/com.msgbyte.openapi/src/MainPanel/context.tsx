import React, { useContext } from 'react';
import { OpenApp } from './types';

interface OpenAppInfoContextProps extends OpenApp {
  refresh: () => Promise<void>;
  onSelectApp: (appId: string | null) => void;
}

const OpenAppInfoContext = React.createContext<OpenAppInfoContextProps>(null);
OpenAppInfoContext.displayName = 'OpenAppInfoContext';

export const OpenAppInfoProvider: React.FC<
  React.PropsWithChildren<{
    appInfo: OpenApp;
    refresh: OpenAppInfoContextProps['refresh'];
    onSelectApp: OpenAppInfoContextProps['onSelectApp'];
  }>
> = (props) => {
  return (
    <OpenAppInfoContext.Provider
      value={{
        ...props.appInfo,
        refresh: props.refresh,
        onSelectApp: props.onSelectApp,
      }}
    >
      {props.children}
    </OpenAppInfoContext.Provider>
  );
};

export function useOpenAppInfo() {
  return useContext(OpenAppInfoContext);
}
