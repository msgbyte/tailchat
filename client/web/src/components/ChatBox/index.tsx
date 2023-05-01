import { getMessageTextDecorators } from '@/plugin/common';
import React from 'react';
import {
  ChatBoxContextProvider,
  ConverseMessageProvider,
  useConverseMessageContext,
} from 'tailchat-shared';
import { ErrorView } from '../ErrorView';
import { ChatBoxPlaceholder } from './ChatBoxPlaceholder';
import { ChatInputBox } from './ChatInputBox';
import { ChatMessageList } from './ChatMessageList';
import { ChatReply } from './ChatReply';
import { preprocessMessage } from './preprocessMessage';

type ChatBoxProps =
  | {
      converseId: string;
      converseTitle?: React.ReactNode;
      isGroup: false;
      groupId?: string;
    }
  | {
      converseId: string;
      converseTitle?: React.ReactNode;
      isGroup: true;
      groupId: string;
    };
const ChatBoxInner: React.FC<ChatBoxProps> = React.memo((props) => {
  const { converseId, converseTitle } = props;
  const {
    messages,
    loading,
    error,
    isLoadingMore,
    hasMoreMessage,
    fetchMoreMessage,
    sendMessage,
  } = useConverseMessageContext();

  if (loading) {
    return <ChatBoxPlaceholder />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <div className="w-full h-full flex flex-col select-text relative text-sm">
      <ChatMessageList
        key={converseId}
        title={converseTitle}
        messages={messages}
        isLoadingMore={isLoadingMore}
        hasMoreMessage={hasMoreMessage}
        onLoadMore={fetchMoreMessage}
      />

      <ChatReply />

      <ChatInputBox
        onSendMsg={(msg, meta) => {
          const content = preprocessMessage(msg);
          sendMessage({
            converseId: props.converseId,
            groupId: props.groupId,
            content,
            plain: getMessageTextDecorators().serialize(content),
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
      <ConverseMessageProvider
        converseId={props.converseId}
        isGroup={props.isGroup}
      >
        <ChatBoxInner {...props} />
      </ConverseMessageProvider>
    </ChatBoxContextProvider>
  );
});
ChatBox.displayName = 'ChatBox';
