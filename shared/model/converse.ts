import { request } from '../api/request';

export interface ChatConverseInfo {
  _id: string;
  name: string;
  type: 'DM' | 'Group';
  members: string[];
}

/**
 * 尝试创建私聊会话
 * 如果已创建则返回之前的
 */
export async function createDMConverse(
  targetId: string
): Promise<ChatConverseInfo> {
  const { data } = await request.post('/api/chat/converse/createDMConverse', {
    targetId,
  });

  return data;
}

/**
 * 获取会话信息
 * @param converseId 会话ID
 */
export async function fetchConverseInfo(
  converseId: string
): Promise<ChatConverseInfo> {
  const { data } = await request.get('/api/chat/converse/findConverseInfo', {
    params: {
      converseId,
    },
  });

  return data;
}
