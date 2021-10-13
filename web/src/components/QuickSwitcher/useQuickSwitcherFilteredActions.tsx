import { t } from 'tailchat-shared';
import _take from 'lodash/take';
import { useMemo } from 'react';
import type { QuickActionContext } from './useQuickSwitcherActionContext';

interface QuickAction {
  key: string;
  label: string;
  action: (context: QuickActionContext) => void;
}

const builtinActions: QuickAction[] = [
  {
    key: 'personal',
    label: t('个人主页'),
    action({ navigate }) {
      navigate('/main/personal/friends');
    },
  },
  {
    key: 'plugins',
    label: t('插件中心'),
    action({ navigate }) {
      navigate('/main/personal/plugins');
    },
  },
];

/**
 * 过滤快速搜索操作
 * @param keyword 关键字
 */
export function useQuickSwitcherFilteredActions(keyword: string) {
  const filteredActions = useMemo(() => {
    return _take(
      builtinActions.filter((action) => action.label.includes(keyword)),
      5
    );
  }, [keyword]);

  return filteredActions;
}
