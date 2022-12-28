import React from 'react';
import { Avatar } from 'tailchat-design';
import { useCachedUserInfo } from 'tailchat-shared';

interface UserAvatarProps {
  userId: string;
  className?: string;
  style?: React.CSSProperties;
  size?: 'large' | 'small' | 'default' | number;
}

/**
 * 用户头像组件
 */
export const UserAvatar: React.FC<UserAvatarProps> = React.memo((props) => {
  const cachedUserInfo = useCachedUserInfo(props.userId);

  return (
    <Avatar
      className={props.className}
      style={props.style}
      size={props.size}
      src={cachedUserInfo.avatar}
      name={cachedUserInfo.nickname}
    />
  );
});
UserAvatar.displayName = 'UserAvatar';
