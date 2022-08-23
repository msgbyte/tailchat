import { useRef, MutableRefObject } from 'react';

export function useUpdateRef<T>(state: T): MutableRefObject<T> {
  const ref = useRef<T>(state);
  ref.current = state;

  return ref;
}
