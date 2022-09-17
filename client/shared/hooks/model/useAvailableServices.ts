import { useEffect } from 'react';
import { fetchAvailableServices } from '../../model/common';
import { useAsyncFn } from '../useAsyncFn';
import { useMemoizedFn } from '../useMemoizedFn';

/**
 * 用于监测服务是否可用的hooks
 */
export function useAvailableServices() {
  const [{ loading, value: availableServices }, fetch] = useAsyncFn(() =>
    fetchAvailableServices()
  );

  useEffect(() => {
    fetch();
  }, []);

  const refetch = useMemoizedFn(async () => {
    fetchAvailableServices.clearCache();
    fetch();
  });

  return { loading, availableServices, refetch };
}
