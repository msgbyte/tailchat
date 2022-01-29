import React, { useContext } from 'react';
import { OpenApp } from './types';

const OpenAppInfoContext = React.createContext<OpenApp>(null);
OpenAppInfoContext.displayName = 'OpenAppInfoContext';

export const OpenAppInfoProvider: React.FC<{ appInfo: OpenApp }> = (props) => {
  return (
    <OpenAppInfoContext.Provider value={props.appInfo}>
      {props.children}
    </OpenAppInfoContext.Provider>
  );
};

export function useOpenAppInfo() {
  return useContext(OpenAppInfoContext);
}
