import { isBrowser, useRafState } from 'pawchat-shared';
import { useEffect } from 'react';

// Reference: https://github.com/streamich/react-use/blob/master/src/useWindowSize.ts

export const useWindowSize = (
  initialWidth = Infinity,
  initialHeight = Infinity
) => {
  const [state, setState] = useRafState<{ width: number; height: number }>({
    width: isBrowser ? window.innerWidth : initialWidth,
    height: isBrowser ? window.innerHeight : initialHeight,
  });

  useEffect((): (() => void) | void => {
    if (isBrowser) {
      const handler = () => {
        setState({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handler);

      return () => {
        window.removeEventListener('resize', handler);
      };
    }
  }, []);

  return state;
};
