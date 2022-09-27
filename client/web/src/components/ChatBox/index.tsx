import React from 'react';
import { ChatBoxContextProvider, useConverseMessage } from 'tailchat-shared';
import { ErrorView } from '../ErrorView';
import { ChatBoxPlaceholder } from './ChatBoxPlaceholder';
import { ChatInputBox } from './ChatInputBox';
import { ChatMessageList } from './ChatMessageList';
import { ChatReply } from './ChatReply';
import { preprocessMessage } from './preprocessMessage';
import { useMessageAck } from './useMessageAck';

type ChatBoxProps =
  | {
      converseId: string;
      isGroup: false;
      groupId?: string;
    }
  | {
      converseId: string;
      isGroup: true;
      groupId: string;
    };
const ChatBoxInner: React.FC<ChatBoxProps> = React.memo((props) => {
  const { converseId, isGroup } = props;
  const {
    messages,
    loading,
    error,
    isLoadingMore,
    hasMoreMessage,
    handleFetchMoreMessage,
    handleSendMessage,
  } = useConverseMessage({
    converseId,
    isGroup,
  });
  useMessageAck(converseId);

  if (loading) {
    return <ChatBoxPlaceholder />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <div className="w-full h-full flex flex-col select-text">
      <ChatMessageList
        key={converseId}
        messages={messages}
        isLoadingMore={isLoadingMore}
        hasMoreMessage={hasMoreMessage}
        onLoadMore={handleFetchMoreMessage}
      />

      <ChatReply />

      <ChatInputBox
        onSendMsg={(msg, meta) => {
          handleSendMessage({
            converseId: props.converseId,
            groupId: props.groupId,
            content: preprocessMessage(msg),
            meta,
          });
        }}
      />
    </div>
  );
});
ChatBoxInner.displayName = 'ChatBoxInner';

export const ChatBox: React.FC<ChatBoxProps> = React.memo((props) => {
  return (
    <ChatBoxContextProvider>
      <ChatBoxInner {...props} />
    </ChatBoxContextProvider>
  );
});
ChatBox.displayName = 'ChatBox';
