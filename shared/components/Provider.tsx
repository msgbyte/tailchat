import React from 'react';
import { CacheProvider } from '../cache/Provider';

export const PawProvider: React.FC = React.memo((props) => {
  return <CacheProvider>{props.children}</CacheProvider>;
});
PawProvider.displayName = 'PawProvider';
