import React from 'react';
import {
  isValidStr,
  useCachedUserInfo,
  useFriendNickname,
} from 'tailchat-shared';

interface UserNameProps {
  userId: string;
  className?: string;
  style?: React.CSSProperties;
  showDiscriminator?: boolean;
  fallbackName?: string;
}

/**
 * 纯净版的 UserName, 无需redux上下文
 */
export const UserNamePure: React.FC<UserNameProps> = React.memo((props) => {
  const { userId, showDiscriminator, className, style, fallbackName } = props;
  const cachedUserInfo = useCachedUserInfo(userId);

  return (
    <span className={className} style={style}>
      {cachedUserInfo.nickname ??
        (isValidStr(fallbackName) ? fallbackName : <span>&nbsp;</span>)}

      {showDiscriminator && (
        <UserNameDiscriminator discriminator={cachedUserInfo.discriminator} />
      )}
    </span>
  );
});
UserNamePure.displayName = 'UserNamePure';

/**
 * 增加好友名称patch的 UserName
 */
export const UserName: React.FC<UserNameProps> = React.memo((props) => {
  const { userId, showDiscriminator, className, style, fallbackName } = props;
  const cachedUserInfo = useCachedUserInfo(userId);
  const friendNickname = useFriendNickname(userId);

  return (
    <span className={className} style={style}>
      {friendNickname ? (
        <>
          {friendNickname}
          <span className="opacity-60">({cachedUserInfo.nickname})</span>
        </>
      ) : (
        cachedUserInfo.nickname ??
        (isValidStr(fallbackName) ? fallbackName : <span>&nbsp;</span>)
      )}

      {showDiscriminator && (
        <UserNameDiscriminator discriminator={cachedUserInfo.discriminator} />
      )}
    </span>
  );
});
UserName.displayName = 'UserName';

const UserNameDiscriminator: React.FC<{ discriminator: string }> = React.memo(
  ({ discriminator }) => {
    return (
      <span className="text-gray-500 dark:text-gray-300 opacity-0 group-hover:opacity-100">
        #{discriminator}
      </span>
    );
  }
);
UserNameDiscriminator.displayName = 'UserNameDiscriminator';
