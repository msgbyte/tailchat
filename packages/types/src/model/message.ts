export interface ChatMessageReaction {
  name: string;
  author: string;
}

export interface ChatMessage {
  _id: string;

  content: string;

  author?: string;

  groupId?: string;

  converseId: string;

  reactions?: ChatMessageReaction[];

  hasRecall?: boolean;

  meta?: Record<string, unknown>;

  createdAt?: string;

  updatedAt?: string;
}

export const chatConverseType = [
  'DM', // 私信
  'Multi', // 多人会话
  'Group', // 群组
] as const;

export type ChatConverseType = (typeof chatConverseType)[number];

export interface ChatConverse {
  _id: string;

  name?: string;

  type: ChatConverseType;

  members: string[];
}
