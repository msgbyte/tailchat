import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isDevelopment } from '../utils/environment';
import { queryClient } from './';

/**
 * 缓存上下文
 */
export const CacheProvider: React.FC = React.memo((props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}

      {/* TODO: 待放到web上 */}
      {isDevelopment && (
        <ReactQueryDevtools
          position="bottom-left"
          toggleButtonProps={{ style: { left: 8, bottom: 50 } }}
        />
      )}
    </QueryClientProvider>
  );
});
CacheProvider.displayName = 'CacheProvider';
