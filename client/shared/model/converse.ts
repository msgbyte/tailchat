import { request } from '../api/request';

export enum ChatConverseType {
  DM = 'DM',
  Group = 'Group',
}

export interface ChatConverseInfo {
  _id: string;
  name: string;
  type: ChatConverseType;
  members: string[];
}

/**
 * 尝试创建私聊会话
 * 如果已创建则返回之前的
 */
export async function createDMConverse(
  memberIds: string[]
): Promise<ChatConverseInfo> {
  const { data } = await request.post('/api/chat/converse/createDMConverse', {
    memberIds,
  });

  return data;
}

/**
 * 在多人会话中添加成员
 */
export async function appendDMConverseMembers(
  converseId: string,
  memberIds: string[]
) {
  const { data } = await request.post(
    '/api/chat/converse/appendDMConverseMembers',
    {
      converseId,
      memberIds,
    }
  );

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

/**
 * 更新会话已读
 * @param converseId 会话ID
 * @param lastMessageId 最后一条消息ID
 */
export async function updateAck(converseId: string, lastMessageId: string) {
  await request.post('/api/chat/ack/update', { converseId, lastMessageId });
}

interface AckInfo {
  userId: string;
  converseId: string;
  lastMessageId: string;
}

/**
 * 获取用户存储在远程的会话信息
 */
export async function fetchUserAck(): Promise<AckInfo[]> {
  const { data } = await request.get('/api/chat/ack/all');

  if (!Array.isArray(data)) {
    return [];
  }

  return data;
}
