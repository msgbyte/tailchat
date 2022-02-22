import React, { useContext } from 'react';
import type { SuggestionDataItem } from 'react-mentions';

/**
 * Input Actions
 */
export interface ChatInputActionContextProps {
  sendMsg: (message: string) => void;
}
export const ChatInputActionContext =
  React.createContext<ChatInputActionContextProps | null>(null);
ChatInputActionContext.displayName = 'ChatInputContext';

export function useChatInputActionContext() {
  return useContext(ChatInputActionContext);
}

/**
 * Input Mentions
 */
interface ChatInputMentionsContextProps {
  users: SuggestionDataItem[];
}
const ChatInputMentionsContext =
  React.createContext<ChatInputMentionsContextProps | null>(null);
ChatInputMentionsContext.displayName = 'ChatInputMentionsContext';

export const ChatInputMentionsContextProvider: React.FC<ChatInputMentionsContextProps> =
  React.memo((props) => {
    return (
      <ChatInputMentionsContext.Provider value={{ users: props.users }}>
        {props.children}
      </ChatInputMentionsContext.Provider>
    );
  });
ChatInputMentionsContextProvider.displayName =
  'ChatInputMentionsContextProvider';

export function useChatInputMentionsContext(): ChatInputMentionsContextProps {
  const context = useContext(ChatInputMentionsContext);

  return {
    users: context?.users ?? [],
  };
}
