import { useRef } from 'react';
import { useEffectOnce } from './useEffectOnce';

// Reference: https://github.com/streamich/react-use/blob/master/src/useUnmount.ts

export const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn);

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn;

  useEffectOnce(() => () => fnRef.current());
};
