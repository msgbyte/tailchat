import { useLayoutEffect, useState } from 'react';
import { shallowEqual } from 'react-redux';

/**
 * 对输入对象增加一层浅比较, 如果对象浅比较结果一致则返回原对象(防止更新)
 */
export function useShallowObject<T>(object: T): T {
  const [state, setState] = useState<T>(object);

  useLayoutEffect(() => {
    if (!shallowEqual(state, object)) {
      setState(object);
    }
  }, [object]);

  return state;
}
