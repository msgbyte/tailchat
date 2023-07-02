/**
 * 收件箱记录项类型
 */
export interface BasicInboxItem {
  _id: string;
  /**
   * 用户id
   */
  userId: string;
  /**
   * 是否已读
   */
  readed: boolean;
  type: string;
  payload?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface MessageInboxItem extends BasicInboxItem {
  type: 'message';
  /**
   * @deprecated ALl info should move into payload
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
    messageAuthor: string;
    messageSnippet: string;
    messagePlainContent?: string;
  };
}

export interface MarkdownInboxItem extends BasicInboxItem {
  type: 'markdown';

  payload: {
    title?: string;
    content: string;
    /**
     * 消息来源
     */
    source?: string;
  };
}

export type InboxItem = MessageInboxItem | MarkdownInboxItem;
