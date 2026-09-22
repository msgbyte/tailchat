import { getReduxStore, AppStore } from '../redux/store';
import { isValidStr } from '../utils/string-helper';
import { CacheKey, getCachedUserInfo } from '../cache/cache';
import { queryClient } from '../cache';
import { t } from '../i18n';
import { ChatConverseInfo, fetchConverseInfo } from '../model/converse';
import { appendUserDMConverse } from '../model/user';
import type { FriendInfo } from '../redux/slices/user';
import { chatActions } from '../redux/slices/chat';
import type { RequestError } from '../api/request';

const converseRefreshes = new Map<
  string,
  Promise<ChatConverseInfo | undefined>
>();

export function removeDMConverseLocally(
  converseId: string,
  store: AppStore = getReduxStore()
) {
  store.dispatch(chatActions.removeDMConverse({ converseId }));
  converseRefreshes.delete(converseId);
  queryClient.removeQueries([CacheKey.converse, converseId], { exact: true });
  queryClient.removeQueries([CacheKey.converseAck, converseId], {
    exact: true,
  });
}

/**
 * 只有服务端确认的成员关系才能恢复已退出的会话。
 */
export function refreshDMConverse(
  converseId: string,
  currentUserId: string,
  store: AppStore = getReduxStore()
): Promise<ChatConverseInfo | undefined> {
  const version =
    store.getState().chat.converseMembership[converseId]?.version ?? 0;
  const run = async (): Promise<ChatConverseInfo | undefined> => {
    // 成员验证不复用缓存；同时开始的调用等待最新请求，不互相取消。
    const result = await fetchConverseInfo(converseId).then(
      (converse) => ({ converse, error: undefined }),
      (error: RequestError) => ({ converse: undefined, error })
    );
    if (
      (store.getState().chat.converseMembership[converseId]?.version ?? 0) !==
      version
    ) {
      return;
    }
    const latestRefresh = converseRefreshes.get(converseId);
    if (latestRefresh && latestRefresh !== refresh) {
      return latestRefresh;
    }
    if (result.error && result.error.code !== 403) {
      throw result.error;
    }
    if (!result.converse?.members.includes(currentUserId)) {
      removeDMConverseLocally(converseId, store);
      return;
    }
    store.dispatch(
      chatActions.restoreDMConverse({ converse: result.converse, version })
    );
    return result.converse;
  };
  const refresh = run();
  converseRefreshes.set(converseId, refresh);
  return refresh;
}

/**
 * 确保私信会话存在
 */
export async function ensureDMConverse(
  converseId: string,
  currentUserId: string
): Promise<ChatConverseInfo> {
  const store = getReduxStore();
  const version =
    store.getState().chat.converseMembership[converseId]?.version ?? 0;
  const converse = await refreshDMConverse(converseId, currentUserId, store);
  if (!converse) {
    throw new Error(t('会话没有权限'));
  }

  await appendUserDMConverse(converseId); // 添加到私人会话列表

  if (
    (store.getState().chat.converseMembership[converseId]?.version ?? 0) !==
    version
  ) {
    throw new Error(t('会话没有权限'));
  }

  return converse;
}

export function buildFriendNicknameMap(
  friends: FriendInfo[]
): Record<string, string> {
  const friendNicknameMap: Record<string, string> = friends.reduce(
    (prev, curr) => {
      return {
        ...prev,
        [curr.id]: curr.nickname,
      };
    },
    {}
  );

  return friendNicknameMap;
}

/**
 * 获取私信会话的会话名
 * @param userId 当前用户的ID(即自己)
 * @param converse 会话信息
 */
export async function getDMConverseName(
  userId: string,
  converse: Pick<ChatConverseInfo, 'name' | 'members'>
): Promise<string> {
  if (isValidStr(converse.name)) {
    return converse.name;
  }

  const otherConverseMembers = converse.members.filter((m) => m !== userId); // 成员Id
  const otherMembersInfo = await Promise.all(
    otherConverseMembers.map((memberId) => getCachedUserInfo(memberId))
  );
  const friends = getReduxStore().getState().user.friends;
  const friendNicknameMap = buildFriendNicknameMap(friends);

  const memberNicknames = otherMembersInfo.map((m) => {
    if (friendNicknameMap[m._id]) {
      return friendNicknameMap[m._id];
    }

    return m.nickname ?? '';
  });
  const len = memberNicknames.length;

  if (len === 0) {
    return t('多人会话');
  } else if (len === 1) {
    return memberNicknames[0] ?? '';
  } else if (len === 2) {
    return `${memberNicknames[0]}, ${memberNicknames[1]}`;
  } else {
    return `${memberNicknames[0]}, ${memberNicknames[1]} ...`;
  }
}
