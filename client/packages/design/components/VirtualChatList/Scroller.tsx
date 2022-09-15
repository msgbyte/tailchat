import React, { PropsWithChildren, useMemo, useRef, useState } from 'react';
import { ResizeWatcher } from './ResizeWatcher';
import { useMemoizedFn, useDebounceFn, usePrevious } from 'ahooks';
import { IsForward, Vector } from './types';
import clsx from 'clsx';

export interface ScrollerRef {
  scrollTo: (position: Vector) => void;
  getMaxPosition: () => Vector;
}

type ScrollerProps = PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  isLock?: boolean;
  scrollingClassName?: string;
  onScroll?: (
    position: Vector,
    detail: {
      forward: IsForward;
      isUserScrolling: boolean;
      isMouseDown: boolean;
    }
  ) => void;
  onScrollEnd?: (position: Vector) => void;
  onContainerResize?: (info: {
    containerSize: Vector;
    position: Vector;
  }) => void;
}>;

const DEFAULT_POS = { x: 0, y: 0 };

/**
 * 滚动状态管理组件
 */
export const Scroller = React.forwardRef<ScrollerRef, ScrollerProps>(
  (props, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const style = useMemo(() => {
      if (props.isLock ?? false) {
        return { ...props.style, overflow: 'hidden' };
      }
      return props.style;
    }, []);

    const [isScroll, setIsScroll] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const { run: setIsScrollLazy } = useDebounceFn(
      (val) => {
        setIsScroll(val);
      },
      {
        leading: false,
        trailing: true,
        wait: 300,
      }
    );

    const getPosition = useMemoizedFn(() => {
      if (!wrapperRef.current) {
        return DEFAULT_POS;
      }
      return {
        x: wrapperRef.current.scrollLeft,
        y: wrapperRef.current.scrollTop,
      };
    });

    const getContainerSize = useMemoizedFn(() => {
      if (!wrapperRef.current) {
        return DEFAULT_POS;
      }
      return {
        x: wrapperRef.current.clientWidth,
        y: wrapperRef.current.clientHeight,
      };
    });

    const { run: handleEndScrollLazy } = useDebounceFn(
      () => {
        setIsScroll(false);
        if (props.onScrollEnd) {
          props.onScrollEnd(getPosition());
        }
      },
      {
        leading: false,
        trailing: true,
        wait: 300,
      }
    );

    const handleWheel = useMemoizedFn(() => {
      setIsScroll(true);
      setIsScrollLazy(false);
    });

    const handleMouseDown = useMemoizedFn(() => {
      setIsMouseDown(true);
    });

    const handleMouseUp = useMemoizedFn(() => {
      setIsMouseDown(false);
    });

    const prevPosition = usePrevious(getPosition()) ?? DEFAULT_POS;
    const handleMouseScroll = useMemoizedFn(() => {
      const isUserScrolling = isScroll || isMouseDown;
      const currentPosition = getPosition();
      const forward = {
        x: currentPosition.x > prevPosition.x,
        y: currentPosition.y > prevPosition.y,
      };
      setIsScroll(true);
      handleEndScrollLazy();
      if (props.onScroll) {
        props.onScroll(currentPosition, {
          forward,
          isUserScrolling,
          isMouseDown: isMouseDown,
        });
      }
    });

    const handleResize = useMemoizedFn(() => {
      if (props.onContainerResize) {
        props.onContainerResize({
          containerSize: getContainerSize(),
          position: getPosition(),
        });
      }
    });

    return (
      <ResizeWatcher wrapperStyle={{ height: '100%' }} onResize={handleResize}>
        <div
          key="scroller"
          className={clsx(props.className, {
            [props.scrollingClassName ?? 'scrolling']: isScroll,
          })}
          style={style}
          ref={wrapperRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onScroll={handleMouseScroll}
        >
          <div
            className="scroller_content"
            key="scroller_content"
            style={props.innerStyle}
            ref={innerRef}
          >
            {props.children}
          </div>
        </div>
      </ResizeWatcher>
    );
  }
);
Scroller.displayName = 'Scroller';
