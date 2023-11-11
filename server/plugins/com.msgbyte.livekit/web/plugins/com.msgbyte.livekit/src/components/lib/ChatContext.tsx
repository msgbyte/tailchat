import { useRoomContext } from '@livekit/components-react';
import React, { useContext, useEffect, useState } from 'react';
import { ReceivedChatMessage, setupChat } from '@livekit/components-core';
import { useObservableState } from '../../utils/useObservableState';

const ChatContext = React.createContext({
  send: async (message: string) => {},
  chatMessages: [] as ReceivedChatMessage[],
  isSending: false,
});
ChatContext.displayName = 'ChatContext';

export const ChatProvider: React.FC<React.PropsWithChildren> = React.memo(
  (props) => {
    const chatContext = useSetupChat();

    return (
      <ChatContext.Provider value={chatContext}>
        {props.children}
      </ChatContext.Provider>
    );
  }
);
ChatProvider.displayName = 'ChatProvider';

function useSetupChat() {
  const room = useRoomContext();
  const [setup, setSetup] = useState<ReturnType<typeof setupChat>>();
  const isSending = useObservableState(setup?.isSendingObservable, false);
  const chatMessages = useObservableState<ReceivedChatMessage[]>(
    setup?.messageObservable,
    []
  );

  useEffect(() => {
    const setupChatReturn = setupChat(room);
    setSetup(setupChatReturn);

    return setupChatReturn.destroy;
  }, [room]);

  return { send: setup?.send, chatMessages, isSending };
}

export function useChatContext() {
  return useContext(ChatContext);
}
