/**
 * 检查组件变动情况(是什么导致了组件刷新)
 * Fork from: https://github.com/devhubapp/devhub/blob/master/packages/components/src/hooks/use-why-did-you-update.ts
 */

import { parse, stringify } from 'flatted';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
import { useEffect, useRef } from 'react';
import { isDevelopment } from '../utils/environment';

interface UseWhyDidYouUpdateCallback<T> {
  onChangeFound?: (data: {
    changesObj: Record<
      string,
      {
        from: T;
        to: T;
        isDeepEqual: boolean;
        changedKeys?: string[];
      }
    >;
  }) => void;
  onNoChangeFound?: () => void;
}

/**
 * Quickly see which prop changed
 * and caused a re-render by adding a single line to the component.
 *
 * USAGE:
 * function MyComponent(props) {
 *   useWhyDidYouUpdate('MyComponent', props)
 *
 *   return <div ... />
 * }
 *
 * OUTPUT:
 * [why-did-you-update] MyComponent { myProp: { from 'oldvalue', to: 'newvalue' } }
 *
 * SHARE:
 * This tip on Twitter: https://twitter.com/brunolemos/status/1090377532845801473
 * Also follow @brunolemos: https://twitter.com/brunolemos
 */
export function useWhyDidYouUpdate<T>(
  name: string,
  props: Record<string, T>,
  { onChangeFound, onNoChangeFound }: UseWhyDidYouUpdateCallback<T> = {}
) {
  const latestProps = useRef(props);

  useEffect(() => {
    if (!isDevelopment) return;

    const allKeys = Object.keys({ ...latestProps.current, ...props });

    const changesObj: Record<
      string,
      {
        from: T;
        to: T;
        isDeepEqual: boolean;
        changedKeys?: string[];
      }
    > = {};
    allKeys.forEach((key) => {
      if (latestProps.current[key] !== props[key]) {
        changesObj[key] = {
          from: latestProps.current[key],
          to: props[key],
          changedKeys:
            props[key] && typeof props[key] === 'object'
              ? Object.keys(latestProps.current[key])
                  .map((k) =>
                    _get(latestProps.current, [key, k]) ===
                    _get(props, [key, k])
                      ? ''
                      : k
                  )
                  .filter(Boolean)
              : undefined,
          isDeepEqual: _isEqual(latestProps.current[key], props[key]),
        };
      }
    });

    if (Object.keys(changesObj).length) {
      if (onChangeFound) {
        onChangeFound({ changesObj });
      } else {
        // eslint-disable-next-line no-console
        console.log('[why-did-you-update]', name, {
          changes: parse(stringify(changesObj)),
          props: { from: latestProps.current, to: props },
        });
      }
    } else if (onNoChangeFound) {
      onNoChangeFound();
    }

    latestProps.current = props;
  });
}
