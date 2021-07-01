import { useCallback, useEffect, useRef } from 'react';

// Reference: https://github.com/streamich/react-use/blob/master/src/useMountedState.ts

export function useMountedState(): () => boolean {
  const mountedRef = useRef<boolean>(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
}
