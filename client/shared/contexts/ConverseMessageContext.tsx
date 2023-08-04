import React from 'react';
import type { ChatMessage, SendMessagePayload } from '../model/message';
import { useConverseMessage } from '../redux/hooks/useConverseMessage';
import { createContextFactory } from './factory';

interface ConverseMessageContextProps {
  messages: ChatMessage[];
  loading: boolean;
  error?: Error;
  isLoadingMore: boolean;
  hasMoreMessage: boolean;
  fetchMoreMessage: () => Promise<void>;
  sendMessage: (payload: SendMessagePayload) => void | Promise<void>;
}

const {
  Context: ConverseMessageContext,
  useContext: useConverseMessageContext,
} = createContextFactory<ConverseMessageContextProps>({
  defaultValue: {} as ConverseMessageContextProps,
  displayName: 'ConverseMessageContext',
});

/**
 * 会话消息列表相关上下文
 */
export const ConverseMessageProvider: React.FC<
  React.PropsWithChildren<{
    converseId: string;
    isGroup: boolean;
  }>
> = React.memo((props) => {
  const { converseId, isGroup } = props;
  const {
    messages,
    loading,
    error,
    isLoadingMore,
    hasMoreMessage,
    handleFetchMoreMessage: fetchMoreMessage,
    handleSendMessage: sendMessage,
  } = useConverseMessage({
    converseId,
    isGroup,
  });

  return (
    <ConverseMessageContext.Provider
      value={{
        messages,
        loading,
        error,
        isLoadingMore,
        hasMoreMessage,
        fetchMoreMessage,
        sendMessage,
      }}
    >
      {props.children}
    </ConverseMessageContext.Provider>
  );
});
ConverseMessageProvider.displayName = 'ConverseMessageProvider';

export { useConverseMessageContext };
