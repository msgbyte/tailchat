import React, { useCallback } from 'react';
import { useSidebarContext } from '../SidebarContext';
import _isNil from 'lodash/isNil';
import { useDrag } from 'react-use-gesture';
import { useIsMobile } from '@/hooks/useIsMobile';
import clsx from 'clsx';

// const ContentDetail = styled.div`
//   flex: 1;
//   background-color: ${(props) => props.theme.style.contentBackgroundColor};
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   overflow: hidden;

//   @media (max-width: 768px) {
//     width: ${(props) => `calc(100vw - ${props.theme.style.navbarWidth})`};
//     min-width: ${(props) => `calc(100vw - ${props.theme.style.navbarWidth})`};
//   }
// `;

// const SidebarContainer = styled.div<{
//   showSidebar: boolean;
// }>`
//   ${(props) => props.theme.mixins.transition('width', 0.2)};
//   width: ${(props) => (props.showSidebar ? props.theme.style.sidebarWidth : 0)};
//   background-color: ${(props) => props.theme.style.sidebarBackgroundColor};
//   overflow: hidden;
//   display: flex;
//   flex-direction: column;
//   flex: none;
// `;

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
 *
 * TODO: 移动端适配
 */
export const PageContent: React.FC<PageContentProps> = React.memo((props) => {
  const { sidebar, children } = props;
  const { showSidebar, setShowSidebar } = useSidebarContext();
  const isMobile = useIsMobile();
  const handleHideSidebar = useCallback(() => {
    setShowSidebar(false);
  }, []);

  const sidebarEl = _isNil(sidebar) ? null : (
    <div
      className={clsx('bg-gray-800 p-2', {
        'w-60': showSidebar,
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

      <div className="flex flex-auto bg-gray-700 relative">
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
