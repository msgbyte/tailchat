import { request } from '../api/request';

export interface ChatMessage {
  _id: string;

  content: string;

  author?: string;

  groupId?: string;

  converseId: string;

  createdAt?: string;

  updatedAt?: string;
}

export interface SendMessagePayload {
  groupId?: string;
  converseId: string;
  content: string;
}

/**
 * 获取会话消息
 * @param converseId 会话ID
 * @param startId 开始ID
 */
export async function fetchConverseMessage(
  converseId: string,
  startId?: string
): Promise<ChatMessage[]> {
  const { data } = await request.get('/api/chat/message/fetchConverseMessage', {
    params: {
      converseId,
      startId,
    },
  });

  return data;
}

/**
 * 发送消息
 * @param payload 消息体
 */
export async function sendMessage(
  payload: SendMessagePayload
): Promise<ChatMessage> {
  const { data } = await request.post('/api/chat/message/sendMessage', payload);

  return data;
}
