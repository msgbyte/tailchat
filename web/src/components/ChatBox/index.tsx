import { Skeleton } from 'antd';
import React from 'react';
import { useConverseMessage } from 'tailchat-shared';
import { AlertErrorView } from '../AlertErrorView';
import { ChatInputBox } from './ChatInputBox';
import { ChatMessageList } from './ChatMessageList';

const ChatBoxPlaceholder: React.FC = React.memo(() => {
  return (
    <div className="px-2 w-2/3">
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
      <Skeleton className="mb-2" avatar={true} paragraph={{ rows: 1 }} />
    </div>
  );
});
ChatBoxPlaceholder.displayName = 'ChatBoxPlaceholder';

export const ChatBox: React.FC<{
  converseId: string;
}> = React.memo((props) => {
  const { messages, loading, error, handleSendMessage } = useConverseMessage(
    props.converseId
  );

  if (loading) {
    return <ChatBoxPlaceholder />;
  }

  if (error) {
    return <AlertErrorView error={error} />;
  }

  return (
    <div className="w-full h-screen flex flex-col select-text">
      <ChatMessageList messages={messages} />

      <ChatInputBox
        onSendMsg={(msg) =>
          handleSendMessage({
            converseId: props.converseId,
            content: msg,
          })
        }
      />
    </div>
  );
});
ChatBox.displayName = 'ChatBox';
