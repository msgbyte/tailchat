import { request } from '../api/request';

interface ConverseInfo {
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
): Promise<ConverseInfo> {
  const { data } = await request.post('/api/chat/converse/createDMConverse', {
    targetId,
  });

  return data;
}
