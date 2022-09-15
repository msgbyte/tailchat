import React, { useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';

type Size = { height: number; width: number };

interface ResizeWatcherProps {
  wrapperStyle?: React.CSSProperties;
  onResize?: (size: Size) => void;
}

/**
 * 当容器大小发生变化时
 * 触发回调
 */
export const ResizeWatcher: React.FC<ResizeWatcherProps> = React.memo(
  (props) => {
    const rootRef = useRef<HTMLDivElement>(null);

    const handleResize = useMemoizedFn((size: Size) => {
      if (props.onResize) {
        props.onResize(size);
      }
    });

    useEffect(() => {
      if (!rootRef.current) {
        return;
      }

      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          const { target, contentRect } = entry;
          if (!target.parentElement) {
            return;
          }

          handleResize({
            width: Math.round(contentRect.width),
            height: Math.round(contentRect.height),
          });
        });
      });
      resizeObserver.observe(rootRef.current);

      return () => {
        if (resizeObserver && rootRef.current) {
          resizeObserver.unobserve(rootRef.current);
          resizeObserver.disconnect();
        }
      };
    }, []);

    return (
      <div style={props.wrapperStyle} ref={rootRef}>
        {props.children}
      </div>
    );
  }
);
ResizeWatcher.displayName = 'ResizeWatcher';
