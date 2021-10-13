import {
  isValidStr,
  t,
  useAppSelector,
  useAsync,
  useUserId,
} from 'tailchat-shared';
import _take from 'lodash/take';
import { useDebugValue, useMemo } from 'react';
import type { QuickActionContext } from './useQuickSwitcherActionContext';
import { getDMConverseName } from 'tailchat-shared';

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

function usePersonalConverseActions(): QuickAction[] {
  const userId = useUserId();
  const converses = useAppSelector((state) =>
    Object.values(state.chat.converses)
  );
  const { value: personalConverseActions = [] } = useAsync(async () => {
    if (!isValidStr(userId)) {
      return [];
    }

    return Promise.all(
      converses.map((converse) =>
        getDMConverseName(userId, converse).then(
          (converseName): QuickAction => ({
            key: `qs#converse#${converse._id}`,
            label: `${t('私信')} ${converseName}`,
            action: ({ navigate }) => {
              navigate(`/main/personal/converse/${converse._id}`);
            },
          })
        )
      )
    );
  }, [userId, converses.map((converse) => converse._id).join(',')]);

  useDebugValue(personalConverseActions);

  return personalConverseActions;
}

/**
 * 过滤快速搜索操作
 * @param keyword 关键字
 */
export function useQuickSwitcherFilteredActions(keyword: string) {
  const allActions = [...builtinActions, ...usePersonalConverseActions()];

  const filteredActions = useMemo(() => {
    return _take(
      allActions.filter((action) => action.label.includes(keyword)),
      5
    );
  }, [keyword, allActions.length]);

  return filteredActions;
}
