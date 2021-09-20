import type { ChatMessage } from '../model/message';

const replyMsgFields = ['_id', 'content', 'author'] as const;
export type ReplyMsgType = Pick<ChatMessage, typeof replyMsgFields[number]>;
