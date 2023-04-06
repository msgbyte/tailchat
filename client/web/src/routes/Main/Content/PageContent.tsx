import React, { PropsWithChildren, useCallback } from 'react';
import { useSidebarContext } from '../SidebarContext';
import _isNil from 'lodash/isNil';
import { EventTypes, useDrag, UserDragConfig } from '@use-gesture/react';
import { useIsMobile } from '@/hooks/useIsMobile';
import clsx from 'clsx';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { useWatch } from 'tailchat-shared';

interface PageContentRootProps extends PropsWithChildren<ReactDOMAttributes> {
  className?: string;
  style?: React.CSSProperties;
}
const PageContentRoot: React.FC<PageContentRootProps> = ({
  className,
  style,
  children,
  ...others
}) => (
  <div
    {...others}
    style={style}
    className={clsx('flex flex-row flex-1 overflow-hidden relative', className)}
  >
    {children}
  </div>
);

const PageGestureWrapper: React.FC<PropsWithChildren> = React.memo((props) => {
  const { setShowSidebar } = useSidebarContext();

  const bind = useDrag<EventTypes['drag'], UserDragConfig>(
    (state) => {
      const { swipe } = state;
      const swipeX = swipe[0];
      if (swipeX > 0) {
        setShowSidebar(true);
      } else if (swipeX < 0) {
        setShowSidebar(false);
      }
    },
    {
      axis: 'x',
      swipe: {
        distance: 5,
      },
    }
  );

  return (
    <PageContentRoot
      style={{
        touchAction: 'pan-x',
      }}
      {...bind()}
    >
      {props.children}
    </PageContentRoot>
  );
});
PageGestureWrapper.displayName = 'PageGestureWrapper';

interface PageContentProps {
  sidebar?: React.ReactNode;
  'data-tc-role'?: string;
}
/**
 * 用于渲染实际页面的组件，即除了导航栏剩余的内容
 */
export const PageContent: React.FC<PropsWithChildren<PageContentProps>> =
  React.memo((props) => {
    const { sidebar, children } = props;
    const { showSidebar, setShowSidebar } = useSidebarContext();
    const isMobile = useIsMobile();
    const handleHideSidebar = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        setShowSidebar(false);
      },
      []
    );

    useWatch([isMobile], () => {
      if (isMobile === false) {
        // 如果不为移动端, 则一定显示侧边栏
        setShowSidebar(true);
      }
    });

    const sidebarEl = _isNil(sidebar) ? null : (
      <div
        className={clsx(
          'bg-sidebar-light dark:bg-sidebar-dark flex-shrink-0 transition-width w-60'
        )}
      >
        {props.sidebar}
      </div>
    );

    // 是否显示遮罩层
    const showMask =
      isMobile === true && showSidebar === true && !_isNil(sidebarEl);

    const contentMaskEl = showMask ? (
      <div
        className="absolute right-0 top-0 bottom-0 z-10"
        style={{ width: 'calc(100% - 15rem)' }} // 15rem is "w-60" which sidebar with
        onClick={handleHideSidebar}
      />
    ) : null;

    const contentEl = children;

    const el = (
      <ErrorBoundary>
        {sidebarEl}

        {contentMaskEl}

        <div
          className={clsx(
            'flex flex-auto bg-content-light dark:bg-content-dark overflow-hidden',
            isMobile &&
              'transform left-0 w-full h-full absolute transition-transform',
            isMobile && {
              'translate-x-60': showSidebar,
              'translate-x-0': !showSidebar,
            }
          )}
          data-tc-role={props['data-tc-role']}
        >
          <div className="tc-content-background" />

          <div
            className={clsx('flex relative w-full', {
              'overflow-auto': !showMask,
              'overflow-hidden': showMask,
            })}
          >
            <ErrorBoundary>{contentEl}</ErrorBoundary>
          </div>
        </div>
      </ErrorBoundary>
    );

    if (isMobile) {
      return <PageGestureWrapper>{el}</PageGestureWrapper>;
    } else {
      return <PageContentRoot>{el}</PageContentRoot>;
    }
  });
PageContent.displayName = 'PageContent';
