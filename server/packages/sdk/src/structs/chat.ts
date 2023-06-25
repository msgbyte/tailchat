import type { InboxItem } from 'tailchat-types';

export interface MessageReactionStruct {
  name: string;
  author?: string;
}

export interface MessageStruct {
  _id: string;
  content: string;
  author: string;
  groupId?: string;
  converseId: string;
  hasRecall: boolean;
  reactions: MessageReactionStruct[];
}

export interface MessageMetaStruct {
  mentions?: string[];
  reply?: {
    _id: string;
    author: string;
    content: string;
  };
}

interface InboxMessageStruct {
  /**
   * 消息所在群组Id
   */
  groupId?: string;

  /**
   * 消息所在会话Id
   */
  converseId: string;

  /**
   * 消息ID
   */
  messageId: string;

  /**
   * 消息片段，用于消息的预览/发送通知
   */
  messageSnippet: string;
}

/**
 * 收件箱记录项类型
 */
export interface BasicInboxItem {
  _id: string;
  userId: string;
  type: string;
  message?: InboxMessageStruct;

  /**
   * 信息体，没有类型
   */
  payload?: object;

  /**
   * 是否已读
   */
  readed: boolean;
}

export type InboxStruct = InboxItem;
