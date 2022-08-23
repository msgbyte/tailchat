import { fetchAvailableServices } from '../../model/common';
import { useAsync } from '../useAsync';

/**
 * 用于监测服务是否可用的hooks
 */
export function useAvailableServices() {
  const { loading, value: availableServices } = useAsync(() =>
    fetchAvailableServices()
  );

  return { loading, availableServices };
}
