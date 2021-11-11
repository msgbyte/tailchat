import { request } from '../api/request';

export interface ChatMessage {
  _id: string;

  content: string;

  author?: string;

  groupId?: string;

  converseId: string;

  reactions?: any[];

  hasRecall?: boolean;

  meta?: Record<string, unknown>;

  createdAt?: string;

  updatedAt?: string;
}

export interface SimpleMessagePayload {
  groupId?: string;
  converseId: string;
  content: string;
}

export interface SendMessagePayload extends SimpleMessagePayload {
  meta?: Record<string, unknown>;
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

/**
 * 撤回消息
 * @param messageId 消息ID
 */
export async function recallMessage(messageId: string): Promise<ChatMessage> {
  const { data } = await request.post('/api/chat/message/recallMessage', {
    messageId,
  });

  return data;
}

/**
 * 基于会话id获取会话最后一条消息的id
 */
export async function fetchConverseLastMessages(
  converseIds: string[]
): Promise<{ converseId: string; lastMessageId: string }[]> {
  const { data } = await request.post(
    '/api/chat/message/fetchConverseLastMessages',
    {
      converseIds,
    }
  );

  return data;
}
