import React from 'react';
import { useCachedUserInfo } from 'tailchat-shared';

interface UserNameProps {
  userId: string;
  className?: string;
  style?: React.CSSProperties;
}

export const UserName: React.FC<UserNameProps> = React.memo((props) => {
  const { userId, className, style } = props;
  const cachedUserInfo = useCachedUserInfo(userId);

  return (
    <span className={className} style={style}>
      {cachedUserInfo.nickname}
    </span>
  );
});
UserName.displayName = 'UserName';
