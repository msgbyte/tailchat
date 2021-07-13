import React from 'react';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './';

/**
 * 缓存上下文
 */
export const CacheProvider: React.FC = React.memo((props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
});
CacheProvider.displayName = 'CacheProvider';
