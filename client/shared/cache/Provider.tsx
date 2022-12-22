import React, { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './';

/**
 * 缓存上下文
 */
export const CacheProvider: React.FC<PropsWithChildren> = React.memo(
  (props) => {
    return (
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    );
  }
);
CacheProvider.displayName = 'CacheProvider';
