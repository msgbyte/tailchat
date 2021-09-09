import { DependencyList, useEffect } from 'react';
import { useTimeoutFn } from './useTimeoutFn';

export type UseDebounceReturn = [() => boolean | null, () => void];

export function useDebounce(
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function,
  ms = 0,
  deps: DependencyList = []
): UseDebounceReturn {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  useEffect(reset, deps);

  return [isReady, cancel];
}
