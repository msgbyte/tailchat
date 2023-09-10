import { useLayoutEffect, useState } from 'react';
import { useEvent } from './useEvent';

export function useLazyValue<T>(value: T, onChange: (val: T) => void) {
  const [inner, setInner] = useState(value);

  useLayoutEffect(() => {
    setInner(value);
  }, [value]);

  const handleChange = useEvent((val: T) => {
    setInner(val);
    onChange(val);
  });

  return [inner, handleChange] as const;
}
