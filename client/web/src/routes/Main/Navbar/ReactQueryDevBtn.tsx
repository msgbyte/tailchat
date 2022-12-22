import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { isDevelopment } from 'tailchat-shared';

/**
 * React Query 的调试面板
 */
export const ReactQueryDevBtn: React.FC = React.memo(() => {
  if (!isDevelopment) {
    return null;
  }

  return (
    <ReactQueryDevtools
      toggleButtonProps={{
        style: {
          position: 'relative',
          zIndex: 0,
        },
      }}
    />
  );
});
ReactQueryDevBtn.displayName = 'ReactQueryDevBtn';
