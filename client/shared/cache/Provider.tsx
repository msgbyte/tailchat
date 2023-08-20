import React, { PropsWithChildren } from 'react';
import { asyncStoragePersister, queryClient } from './';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

/**
 * 缓存上下文
 */
export const CacheProvider: React.FC<PropsWithChildren> = React.memo(
  (props) => {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        {props.children}
      </PersistQueryClientProvider>
    );
  }
);
CacheProvider.displayName = 'CacheProvider';
