import type { ChatMessage } from 'tailchat-shared';

export interface MessageListProps {
  messages: ChatMessage[];
  isLoadingMore: boolean;
  hasMoreMessage: boolean;
  onLoadMore: () => Promise<void>;
}
