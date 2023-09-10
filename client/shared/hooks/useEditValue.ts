import { useCallback, useLayoutEffect, useState } from 'react';

export function useEditValue<T>(value: T, onChange: (val: T) => void) {
  const [inner, setInner] = useState(value);

  useLayoutEffect(() => {
    setInner(value);
  }, [value]);

  const onSave = useCallback(() => {
    onChange(inner);
  }, [inner, onChange]);

  return [inner, setInner, onSave] as const;
}
