import React from 'react';
import { CacheProvider } from '../cache/Provider';
import { ColorSchemeContextProvider } from '../contexts/ColorSchemeContext';

export const TcProvider: React.FC = React.memo((props) => {
  return (
    <CacheProvider>
      <ColorSchemeContextProvider>{props.children}</ColorSchemeContextProvider>
    </CacheProvider>
  );
});
TcProvider.displayName = 'TcProvider';
