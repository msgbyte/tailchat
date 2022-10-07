import React from 'react';
import { Avatar } from 'tailchat-design';
import { useCachedUserInfo } from 'tailchat-shared';

/**
 * 用户头像组件
 */
export const UserAvatar: React.FC<{
  userId: string;
  className?: string;
}> = React.memo((props) => {
  const { userId, className } = props;
  const cachedUserInfo = useCachedUserInfo(userId);

  return (
    <Avatar
      className={className}
      src={cachedUserInfo.avatar}
      name={cachedUserInfo.nickname}
    />
  );
});
UserAvatar.displayName = 'UserAvatar';
