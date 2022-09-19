import { NavigateOptions, To, useNavigate } from 'react-router';

export interface QuickActionContext {
  navigate: (to: To, options?: NavigateOptions) => void;
}

/**
 * 快速切换操作上下文信息
 */
export function useQuickSwitcherActionContext(): QuickActionContext {
  const navigate = useNavigate();

  return {
    navigate,
  };
}
