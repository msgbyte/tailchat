import { Skeleton } from 'antd';
import React from 'react';

export const ChatBoxPlaceholder: React.FC = React.memo(() => {
  const paragraph = { rows: 1 };

  return (
    <div className="px-2 w-2/3">
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
      <Skeleton className="mb-2" avatar={true} paragraph={paragraph} />
    </div>
  );
});
ChatBoxPlaceholder.displayName = 'ChatBoxPlaceholder';
