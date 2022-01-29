import { DependencyList, useEffect, useReducer } from 'react';
import type { FunctionReturningPromise } from '../types';
import { useAsyncFn } from './useAsyncFn';

export function useAsyncRefresh<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });
  const [inc, refresh] = useReducer((i) => i + 1, 0);

  useEffect(() => {
    callback();
  }, [callback, inc]);

  return {
    ...state,
    refresh,
  };
}
