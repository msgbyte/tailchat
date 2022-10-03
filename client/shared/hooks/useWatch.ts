import { DependencyList, useLayoutEffect } from 'react';
import { useMemoizedFn } from './useMemoizedFn';

/**
 * 监听变更并触发回调
 */
export function useWatch(deps: DependencyList, cb: () => void) {
  const memoizedFn = useMemoizedFn(cb);
  useLayoutEffect(() => {
    memoizedFn();
  }, deps);
}
