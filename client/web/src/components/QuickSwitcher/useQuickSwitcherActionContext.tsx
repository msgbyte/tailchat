import { useHistory } from 'react-router';

export interface QuickActionContext {
  navigate: (url: string) => void;
}

/**
 * 快速切换操作上下文信息
 */
export function useQuickSwitcherActionContext(): QuickActionContext {
  const history = useHistory();
  return {
    navigate: (url) => {
      history.push(url);
    },
  };
}
