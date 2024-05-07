import { DependencyList, useLayoutEffect, useRef } from 'react';
import { useEvent } from './useEvent';

/**
 * Call once on data ready(validator return true)
 */
export function useDataReady(
  validator: () => boolean,
  cb: () => void,
  deps?: DependencyList
) {
  const isReadyRef = useRef(false);

  const _validator = useEvent(validator);
  const _callback = useEvent(cb);

  useLayoutEffect(() => {
    if (isReadyRef.current) {
      return;
    }

    if (_validator() === true) {
      _callback();
      isReadyRef.current = true;
    }
  }, deps);
}
