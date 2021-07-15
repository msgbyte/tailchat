import { Skeleton } from 'antd';
import React from 'react';

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

export const ChatBox: React.FC = React.memo(() => {
  return (
    <>
      <ChatBoxPlaceholder />
    </>
  );
});
ChatBox.displayName = 'ChatBox';
