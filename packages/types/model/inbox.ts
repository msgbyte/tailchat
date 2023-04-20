/**
 * 收件箱记录项类型
 */
export interface BasicInboxItem {
  _id: string;
  userId: string;
  readed: boolean;
  type: string;
  payload?: Record<string, any>;
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
