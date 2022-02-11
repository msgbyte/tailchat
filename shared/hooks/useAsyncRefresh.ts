import { DependencyList, useCallback, useEffect } from 'react';
import type { FunctionReturningPromise } from '../types';
import { useAsyncFn } from './useAsyncFn';

export function useAsyncRefresh<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    callback();
  }, [callback]);

  const refresh = useCallback(() => {
    return callback();
  }, [callback]);

  return {
    ...state,
    refresh,
  };
}
