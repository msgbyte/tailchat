import { getCachedConverseInfo } from '../cache/cache';
import { t } from '../i18n';
import type { ChatConverseInfo } from '../model/converse';
import { appendUserDMConverse } from '../model/user';

/**
 * 确保私信会话存在
 */
export async function ensureDMConverse(
  converseId: string
): Promise<ChatConverseInfo> {
  const converse = await getCachedConverseInfo(converseId);
  if (converse === null) {
    // TODO
    throw new Error(t('找不到私信会话'));
  }
  await appendUserDMConverse(converseId); // 添加到私人会话列表

  return converse;
}
