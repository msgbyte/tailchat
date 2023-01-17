import { request } from '../api/request';

/**
 * 收件箱记录项类型
 */
export interface InboxItem {
  _id: string;
  userId: string;
  readed: boolean;
  type: 'message';
  message?: {
    groupId?: string;
    converseId: string;
    messageId: string;
    messageSnippet: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function setInboxAck(inboxItemId: string) {
  await request.post('/api/chat/inbox/ack', {
    inboxItemId,
  });
}
