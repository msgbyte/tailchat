import { useCallback, useEffect, useRef } from 'react';
import { useUpdateRef } from './useUpdateRef';

export function useInterval(
  fn: () => void,
  delay: number | undefined,
  options?: {
    immediate?: boolean;
  }
) {
  const immediate = options?.immediate;

  const fnRef = useUpdateRef(fn);
  const timerRef = useRef<number>();

  useEffect(() => {
    if (typeof delay !== 'number' || delay < 0) {
      return;
    }

    if (immediate) {
      fnRef.current();
    }
    timerRef.current = window.setInterval(() => {
      fnRef.current();
    }, delay);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [delay]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
  }, []);

  return clear;
}
