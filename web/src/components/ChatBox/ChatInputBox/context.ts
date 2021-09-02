import React, { useContext } from 'react';

export interface ChatInputActionContextProps {
  sendMsg: (message: string) => void;
}
export const ChatInputActionContext =
  React.createContext<ChatInputActionContextProps | null>(null);
ChatInputActionContext.displayName = 'ChatInputContext';

export function useChatInputActionContext() {
  return useContext(ChatInputActionContext);
}
