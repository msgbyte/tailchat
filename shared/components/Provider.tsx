import React from 'react';
import { CacheProvider } from '../cache/Provider';
import { DarkModeContextProvider } from '../contexts/DarkModeContext';

export const TcProvider: React.FC = React.memo((props) => {
  return (
    <CacheProvider>
      <DarkModeContextProvider>{props.children}</DarkModeContextProvider>
    </CacheProvider>
  );
});
TcProvider.displayName = 'TcProvider';
