import _take from 'lodash/take';
import { useMemo } from 'react';
import {
  QuickAction,
  useQuickSwitcherAllActions,
} from './useQuickSwitcherAllAction';

/**
 * 过滤快速搜索操作
 * 仅获取前5个
 * @param keyword 关键字
 */
export function useQuickSwitcherFilteredActions(
  keyword: string
): QuickAction[] {
  const allActions = useQuickSwitcherAllActions();

  const filteredActions = useMemo(() => {
    return _take(
      allActions.filter((action) => action.label.includes(keyword)),
      5
    );
  }, [keyword, allActions.length]);

  return filteredActions;
}
