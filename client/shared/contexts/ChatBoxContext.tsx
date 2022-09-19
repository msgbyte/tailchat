import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import _noop from 'lodash/noop';
import type { ReplyMsgType } from '../utils/message-helper';

/**
 * 一个消息盒的上下文
 */

interface ChatBoxContextProps {
  replyMsg: ReplyMsgType | null;
  setReplyMsg: (msg: ReplyMsgType | null) => void;
}
const ChatBoxContext = React.createContext<ChatBoxContextProps>({
  replyMsg: null,
  setReplyMsg: _noop,
});
ChatBoxContext.displayName = 'ChatBoxContext';

export const ChatBoxContextProvider: React.FC<PropsWithChildren> = React.memo(
  (props) => {
    const [replyMsg, setReplyMsg] = useState<ReplyMsgType | null>(null);

    return (
      <ChatBoxContext.Provider
        value={{
          replyMsg,
          setReplyMsg,
        }}
      >
        {props.children}
      </ChatBoxContext.Provider>
    );
  }
);
ChatBoxContextProvider.displayName = 'ChatBoxContextProvider';

export function useChatBoxContext(): ChatBoxContextProps & {
  hasContext: boolean;
  clearReplyMsg: () => void;
} {
  const context = useContext(ChatBoxContext);
  const clearReplyMsg = useCallback(() => {
    context.setReplyMsg(null);
  }, [context.setReplyMsg]);

  return {
    hasContext: context.setReplyMsg !== _noop,
    replyMsg: context.replyMsg,
    setReplyMsg: context.setReplyMsg,
    clearReplyMsg,
  };
}
