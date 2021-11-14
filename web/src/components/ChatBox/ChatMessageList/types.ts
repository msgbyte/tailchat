import type { ChatMessage } from 'tailchat-shared';

export interface MessageListProps {
  messages: ChatMessage[];
  isLoadingMore: boolean;
  hasMoreMessage: boolean;
  onUpdateReadedMessage: (lastMessageId: string) => void;
  onLoadMore: () => Promise<void>;
}
