import { getCachedConverseInfo } from '../cache/cache';
import type { ChatConverseInfo } from '../model/converse';
import { appendUserDMConverse } from '../model/user';

/**
 * 确保私信会话存在
 */
export async function ensureDMConverse(
  converseId: string
): Promise<ChatConverseInfo> {
  const converse = await getCachedConverseInfo(converseId);
  await appendUserDMConverse(converseId);

  return converse;
}
