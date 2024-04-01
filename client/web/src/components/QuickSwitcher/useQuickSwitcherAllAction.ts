import {
  isValidStr,
  t,
  useAppSelector,
  useAsync,
  useUserId,
  getDMConverseName,
  model,
} from 'tailchat-shared';
import { useDebugValue, useMemo } from 'react';
import type { QuickActionContext } from './useQuickSwitcherActionContext';

const ChatConverseType = model.converse.ChatConverseType;

export interface QuickAction {
  key: string;
  source: string;
  label: string;
  action: (context: QuickActionContext) => void;
}

/**
 * 内置操作
 */
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

/**
 * 私信快速会话
 */
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
 * 群组操作
 */
function useGroupPanelActions(): QuickAction[] {
  const groups = useAppSelector((state) => state.group.groups);

  const groupPanelActions = useMemo(() => {
    const list: QuickAction[] = [];

    Object.values(groups).forEach((group) => {
      group.panels.forEach((panel) => {
        list.push({
          key: `qs#grouppanel#${panel.id}`,
          label: `[${group.name}] ${panel.name}`,
          source: 'core',
          action: ({ navigate }) => {
            navigate(`/main/group/${group._id}/${panel.id}`);
          },
        });
      });
    });

    return list;
  }, [groups]);

  useDebugValue(groupPanelActions);

  return groupPanelActions;
}

/**
 * @returns 返回所有的快速操作
 */
export function useQuickSwitcherAllActions() {
  const allActions = [
    ...builtinActions,
    ...useDMConverseActions(),
    ...useGroupPanelActions(),
  ];

  return allActions;
}
