import { request } from '../api/request';

/**
 * 收件箱记录项类型
 */
export interface BasicInboxItem {
  _id: string;
  userId: string;
  readed: boolean;
  type: string;
  payload?: object;
  createdAt: string;
  updatedAt: string;
}

export interface MessageInboxItem extends BasicInboxItem {
  type: 'message';
  /**
   * @deprecated
   */
  message?: {
    groupId?: string;
    converseId: string;
    messageId: string;
    messageSnippet: string;
  };
  payload: {
    groupId?: string;
    converseId: string;
    messageId: string;
    messageSnippet: string;
  };
}

export type InboxItem = MessageInboxItem;

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
