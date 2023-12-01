import { DependencyList, useEffect, useRef } from 'react';
import type { FunctionReturningPromise } from '../types';
import { useAsyncFn } from './useAsyncFn';

// Reference: https://github.com/streamich/react-use/blob/master/src/useAsync.ts

export function useAsync<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = []
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });
  const lockRef = useRef(false);

  useEffect(() => {
    if (lockRef.current === true) {
      return;
    }

    if (deps.length === 0) {
      lockRef.current = true;
    }

    callback();
  }, [callback]);

  return state;
}
