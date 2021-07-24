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
export const ChatBox: React.FC<ChatBoxProps> = React.memo((props) => {
  const { converseId, isGroup } = props;
  const { messages, loading, error, handleSendMessage } = useConverseMessage({
    converseId,
    isGroup,
  });

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
            groupId: props.groupId,
            content: msg,
          })
        }
      />
    </div>
  );
});
ChatBox.displayName = 'ChatBox';
