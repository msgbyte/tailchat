import type { DependencyList } from 'react';
import { isDevelopment, t } from '..';
import { showErrorToasts } from '../manager/ui';
import type { FunctionReturningPromise } from '../types';
import { useAsyncFn } from './useAsyncFn';

export function useAsyncRequest<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [{ loading }, call] = useAsyncFn(async (...args) => {
    try {
      await fn(...args);
    } catch (err) {
      showErrorToasts(isDevelopment ? err : t('系统忙, 请稍后再试'));
      console.error(err);
    }
  }, deps);

  return [{ loading }, call as T] as const;
}
