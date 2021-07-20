import React from 'react';
import { CacheProvider } from '../cache/Provider';

export const TcProvider: React.FC = React.memo((props) => {
  return <CacheProvider>{props.children}</CacheProvider>;
});
TcProvider.displayName = 'TcProvider';
