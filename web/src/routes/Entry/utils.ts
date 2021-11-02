import { useCallback } from 'react';
import { useHistory } from 'react-router';

/**
 * 导航到特定视图
 */
export function useNavToView() {
  const history = useHistory();

  const navToView = useCallback(
    (pathname: string) => {
      // 携带上下文切换路由
      history.push({
        ...history.location,
        pathname,
      });
    },
    [history]
  );

  return navToView;
}
