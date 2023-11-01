import type { DependencyList } from 'react';
import { showErrorToasts } from '../manager/ui';
import type { FunctionReturningPromise } from '../types';
import { useAsyncFn } from './useAsyncFn';

export function useAsyncRequest<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [{ loading, value }, call] = useAsyncFn(async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (err) {
      // showErrorToasts(isDevelopment ? err : t('系统忙, 请稍后再试'));
      showErrorToasts(err); // 暂时放开所有错误抛出，正确的做法应该是仅对于内置代码相关的逻辑显示placeholder报错
      console.error('[useAsyncRequest] error:', err);
    }
  }, deps);

  return [{ loading, value }, call as T] as const;
}
