import { request } from '../api/request';
export type {
  BasicInboxItem,
  MessageInboxItem,
  MarkdownInboxItem,
  InboxItem,
} from 'tailchat-types';

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
