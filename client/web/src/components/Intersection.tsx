/**
 * 监测是否可见
 */

import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { useMemoizedFn } from 'tailchat-shared';

interface IntersectionProps extends PropsWithChildren {
  root?: string;
  rootMargin?: string;

  /**
   * Either a single number or an array of numbers which indicate at what percentage of the target's visibility the observer's callback should be executed. If you only want to detect when visibility passes the 50% mark, you can use a value of 0.5. If you want the callback to run every time visibility passes another 25%, you would specify the array [0, 0.25, 0.5, 0.75, 1]. The default is 0 (meaning as soon as even one pixel is visible, the callback will be run). A value of 1.0 means that the threshold isn't considered passed until every pixel is visible.
   */
  threshold?: number | number[];
  onIntersection?: (target: Element) => void;
  onUnIntersection?: (target: Element) => void;
  onIntersectionUnmount?: () => void;
}
export const Intersection: React.FC<IntersectionProps> = React.memo((props) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleIntersectionChange = useMemoizedFn(
    (entries: IntersectionObserverEntry[]) => {
      const { onIntersection, onUnIntersection } = props;
      entries.forEach((entry) => {
        /**
         * Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=713819
         */
        const { intersectionRatio } = entry;
        if (intersectionRatio > 0) {
          if (onIntersection) {
            onIntersection(entry.target);
          }
        } else if (onUnIntersection) {
          onUnIntersection(entry.target);
        }
      });
    }
  );

  const handleIntersectionUnmount = useMemoizedFn(() => {
    props.onIntersectionUnmount && props.onIntersectionUnmount();
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const root = props.root ? document.querySelector(props.root) : null;
    const intersectionOberver = new IntersectionObserver(
      handleIntersectionChange,
      {
        root,
        rootMargin: props.rootMargin,
        threshold: props.threshold,
      }
    );
    intersectionOberver.observe(ref.current);

    return () => {
      intersectionOberver.disconnect();
      handleIntersectionUnmount();
    };
  }, []);

  return <div ref={ref}>{props.children}</div>;
});
Intersection.displayName = 'Intersection';
