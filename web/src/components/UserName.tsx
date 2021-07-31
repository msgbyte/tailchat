import React from 'react';
import { useCachedUserInfo } from 'tailchat-shared';

export const UserName: React.FC<{
  userId: string;
  className?: string;
}> = React.memo((props) => {
  const { userId, className } = props;
  const cachedUserInfo = useCachedUserInfo(userId);

  return <span className={className}>{cachedUserInfo.nickname}</span>;
});
UserName.displayName = 'UserName';
