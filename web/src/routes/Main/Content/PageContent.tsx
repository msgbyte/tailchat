import React, { useCallback, useEffect } from 'react';
import { useSidebarContext } from '../SidebarContext';
import _isNil from 'lodash/isNil';
import { useDrag } from 'react-use-gesture';
import { useIsMobile } from '@/hooks/useIsMobile';
import clsx from 'clsx';

const PageContentRoot: React.FC = (props) => (
  <div className="flex flex-row flex-1 overflow-hidden">{props.children}</div>
);

interface PageContentProps {
  sidebar?: React.ReactNode;
}

const PageGestureWrapper: React.FC = React.memo((props) => {
  const { setShowSidebar } = useSidebarContext();

  const bind = useDrag(
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
      swipeDistance: 5,
    }
  );

  return <PageContentRoot {...bind()}>{props.children}</PageContentRoot>;
});
PageGestureWrapper.displayName = 'PageGestureWrapper';

/**
 * 用于渲染实际页面的组件，即除了导航栏剩余的内容
 */
export const PageContent: React.FC<PageContentProps> = React.memo((props) => {
  const { sidebar, children } = props;
  const { showSidebar, setShowSidebar } = useSidebarContext();
  const isMobile = useIsMobile();
  const handleHideSidebar = useCallback(() => {
    setShowSidebar(false);
  }, []);

  useEffect(() => {
    if (isMobile === false) {
      // 如果不为移动端, 则一定显示侧边栏
      setShowSidebar(true);
    }
  }, [isMobile]);

  const sidebarEl = _isNil(sidebar) ? null : (
    <div
      className={clsx('bg-gray-800 flex-shrink-0 transition-width', {
        'w-60': showSidebar,
        'w-0': !showSidebar,
      })}
    >
      {props.sidebar}
    </div>
  );

  // 是否显示遮罩层
  const showMask =
    isMobile === true && showSidebar === true && !_isNil(sidebarEl);

  const contentMaskEl = showMask ? (
    <div
      className="absolute left-0 top-0 bottom-0 right-0 z-10"
      onClick={handleHideSidebar}
    />
  ) : null;

  const contentEl = children;

  const el = (
    <>
      {sidebarEl}

      <div className="flex flex-auto bg-gray-700 relative overflow-auto">
        {contentMaskEl}
        {contentEl}
      </div>
    </>
  );

  if (isMobile) {
    return <PageGestureWrapper>{el}</PageGestureWrapper>;
  } else {
    return <PageContentRoot>{el}</PageContentRoot>;
  }
});
PageContent.displayName = 'PageContent';
