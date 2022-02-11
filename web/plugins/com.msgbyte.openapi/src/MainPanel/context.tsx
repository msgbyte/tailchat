import React, { useContext } from 'react';
import { OpenApp } from './types';

interface OpenAppInfoContextProps extends OpenApp {
  refresh: () => Promise<void>;
}

const OpenAppInfoContext = React.createContext<OpenAppInfoContextProps>(null);
OpenAppInfoContext.displayName = 'OpenAppInfoContext';

export const OpenAppInfoProvider: React.FC<{
  appInfo: OpenApp;
  refresh: OpenAppInfoContextProps['refresh'];
}> = (props) => {
  return (
    <OpenAppInfoContext.Provider
      value={{
        ...props.appInfo,
        refresh: props.refresh,
      }}
    >
      {props.children}
    </OpenAppInfoContext.Provider>
  );
};

export function useOpenAppInfo() {
  return useContext(OpenAppInfoContext);
}
