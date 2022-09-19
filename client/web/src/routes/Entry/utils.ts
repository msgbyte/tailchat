import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

/**
 * 导航到特定视图
 */
export function useNavToView() {
  const navigate = useNavigate();
  const location = useLocation();

  const navToView = useCallback(
    (pathname: string) => {
      // 携带上下文切换路由
      navigate({
        ...location,
        pathname,
      });
    },
    [history]
  );

  return navToView;
}
