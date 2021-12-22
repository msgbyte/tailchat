import {
  isValidStr,
  t,
  useAppSelector,
  useAsync,
  useUserId,
} from 'tailchat-shared';
import { useDebugValue } from 'react';
import type { QuickActionContext } from './useQuickSwitcherActionContext';
import { getDMConverseName } from 'tailchat-shared';
import { ChatConverseType } from 'tailchat-shared/model/converse';

export interface QuickAction {
  key: string;
  source: string;
  label: string;
  action: (context: QuickActionContext) => void;
}

const builtinActions: QuickAction[] = [
  {
    key: 'personal',
    source: 'core',
    label: t('个人主页'),
    action({ navigate }) {
      navigate('/main/personal/friends');
    },
  },
  {
    key: 'plugins',
    source: 'core',
    label: t('插件中心'),
    action({ navigate }) {
      navigate('/main/personal/plugins');
    },
  },
];

function useDMConverseActions(): QuickAction[] {
  const userId = useUserId();
  const dmConverses = useAppSelector((state) =>
    Object.values(state.chat.converses).filter(
      (converse) => converse.type === ChatConverseType.DM
    )
  );
  const { value: personalConverseActions = [] } = useAsync(async () => {
    if (!isValidStr(userId)) {
      return [];
    }

    return Promise.all(
      dmConverses.map((converse) =>
        getDMConverseName(userId, converse).then(
          (converseName): QuickAction => ({
            key: `qs#converse#${converse._id}`,
            label: `${t('私信')} ${converseName}`,
            source: 'core',
            action: ({ navigate }) => {
              navigate(`/main/personal/converse/${converse._id}`);
            },
          })
        )
      )
    );
  }, [userId, dmConverses.map((converse) => converse._id).join(',')]);

  useDebugValue(personalConverseActions);

  return personalConverseActions;
}

/**
 * @returns 返回所有的快速操作
 */
export function useQuickSwitcherAllActions() {
  const allActions = [...builtinActions, ...useDMConverseActions()];

  return allActions;
}
