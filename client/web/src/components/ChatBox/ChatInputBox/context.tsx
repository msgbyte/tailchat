import React, { PropsWithChildren, useContext } from 'react';
import type { SuggestionDataItem } from 'react-mentions';
import { useShallowObject } from 'tailchat-shared';

/**
 * Input Actions
 */
export interface ChatInputActionContextProps {
  sendMsg: (message: string) => void;
  appendMsg: (message: string) => void;
}
export const ChatInputActionContext =
  React.createContext<ChatInputActionContextProps>(
    {} as ChatInputActionContextProps
  );
ChatInputActionContext.displayName = 'ChatInputActionContext';

export function useChatInputActionContext() {
  return useContext(ChatInputActionContext);
}

/**
 * Input Mentions
 */
interface ChatInputMentionsContextProps extends PropsWithChildren {
  users: SuggestionDataItem[];
  panels: SuggestionDataItem[];
  placeholder?: string;
  disabled?: boolean;
}
const ChatInputMentionsContext =
  React.createContext<ChatInputMentionsContextProps | null>(null);
ChatInputMentionsContext.displayName = 'ChatInputMentionsContext';

export const ChatInputMentionsContextProvider: React.FC<ChatInputMentionsContextProps> =
  React.memo((props) => {
    return (
      <ChatInputMentionsContext.Provider value={useShallowObject({ ...props })}>
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
    panels: context?.panels ?? [],
    placeholder: context?.placeholder,
    disabled: context?.disabled,
  };
}
