import { DependencyList, useEffect } from 'react';
import { FunctionReturningPromise } from '../types';
import { useAsyncFn } from './useAsyncFn';

// Reference: https://github.com/streamich/react-use/blob/master/src/useAsync.ts

export function useAsync<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return state;
}
