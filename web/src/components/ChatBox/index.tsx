import { Skeleton } from 'antd';
import React from 'react';
import { useConverseMessage } from 'pawchat-shared';
import { AlertErrorView } from '../AlertErrorView';

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
  const { messages, loading, error } = useConverseMessage(props.converseId);

  if (loading) {
    return <ChatBoxPlaceholder />;
  }

  if (error) {
    return <AlertErrorView error={error} />;
  }

  return <div>消息数据: {JSON.stringify(messages)}</div>;
});
ChatBox.displayName = 'ChatBox';
