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

/**
 * 设置收件箱某条记录已读
 */
export async function setInboxAck(inboxItemIds: string[]) {
  await request.post('/api/chat/inbox/ack', {
    inboxItemIds,
  });
}

/**
 * 清空收件箱
 */
export async function clearInbox() {
  await request.post('/api/chat/inbox/clear');
}
