/**
 * 收件箱记录项类型
 */
export interface InboxItem {
  _id: string;
  userId: string;
  readed: boolean;
  type: 'message'; // will be more
  message?: {
    groupId?: string;
    converseId: string;
    messageId: string;
    messageSnippet: string;
  };
  payload?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
