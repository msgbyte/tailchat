import type { DependencyList } from 'react';
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
      showErrorToasts(err);
    }
  }, deps);

  return [{ loading }, call] as const;
}
