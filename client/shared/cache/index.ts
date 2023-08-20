import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { getStorage } from '../manager/storage';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 默认缓存10s
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: (key: string) => {
      return getStorage().get(key);
    },
    setItem: (key: string, value: string) => getStorage().set(key, value),
    removeItem: (key: string) => getStorage().remove(key),
  },
});
