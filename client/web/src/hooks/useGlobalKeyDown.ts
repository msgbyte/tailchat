import { useLayoutEffect } from 'react';
import { useUpdateRef } from 'tailchat-shared';

/**
 * keydown hooks
 * 仅接受最初的函数
 */
export function useGlobalKeyDown(
  fn: (e: KeyboardEvent) => void,
  options?: AddEventListenerOptions
) {
  const fnRef = useUpdateRef(fn);

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      typeof fnRef.current === 'function' && fnRef.current(e);
    };

    window.addEventListener('keydown', handleKeyDown, options);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, options);
    };
  }, []);
}
