import { getReduxStore, isValidStr } from '..';
import { getCachedConverseInfo, getCachedUserInfo } from '../cache/cache';
import { t } from '../i18n';
import type { ChatConverseInfo } from '../model/converse';
import { appendUserDMConverse } from '../model/user';
import type { FriendInfo } from '../redux/slices/user';

/**
 * 确保私信会话存在
 */
export async function ensureDMConverse(
  converseId: string,
  currentUserId: string
): Promise<ChatConverseInfo> {
  const converse = await getCachedConverseInfo(converseId);
  if (converse === null) {
    // TODO
    throw new Error(t('找不到私信会话'));
  }

  if (!converse.members.includes(currentUserId)) {
    throw new Error(t('会话没有权限'));
  }

  await appendUserDMConverse(converseId); // 添加到私人会话列表

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

  if (len === 1) {
    return memberNicknames[0] ?? '';
  } else if (len === 2) {
    return `${memberNicknames[0]}, ${memberNicknames[1]}`;
  } else {
    return `${memberNicknames[0]}, ${memberNicknames[1]} ...`;
  }
}
