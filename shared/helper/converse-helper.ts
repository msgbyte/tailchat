import { isValidStr } from '..';
import { getCachedConverseInfo, getCachedUserInfo } from '../cache/cache';
import { t } from '../i18n';
import type { ChatConverseInfo } from '../model/converse';
import { appendUserDMConverse } from '../model/user';

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
  const len = otherConverseMembers.length;
  const otherMembersInfo = await Promise.all(
    otherConverseMembers.map((memberId) => getCachedUserInfo(memberId))
  );

  if (len === 1) {
    return otherMembersInfo[0]?.nickname ?? '';
  } else if (len === 2) {
    return `${otherMembersInfo[0]?.nickname}, ${otherMembersInfo[1]?.nickname}`;
  } else {
    return `${otherMembersInfo[0]?.nickname}, ${otherMembersInfo[1]?.nickname} ...`;
  }
}
