import type { ChatMessage } from 'tailchat-shared';

export interface MessageListProps {
  messages: ChatMessage[];
  title?: React.ReactNode;
  isLoadingMore: boolean;
  hasMoreMessage: boolean;
  onLoadMore: () => Promise<void>;
}
