import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

import { useUnmount } from './useUnmount';

// Reference: https://github.com/streamich/react-use/blob/master/src/useRafState.ts

export const useRafState = <S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] => {
  const frame = useRef(0);
  const [state, setState] = useState(initialState);

  const setRafState = useCallback((value: S | ((prevState: S) => S)) => {
    cancelAnimationFrame(frame.current);

    frame.current = requestAnimationFrame(() => {
      setState(value);
    });
  }, []);

  useUnmount(() => {
    cancelAnimationFrame(frame.current);
  });

  return [state, setRafState];
};
