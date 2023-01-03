import React from 'react';
import { Avatar } from 'tailchat-design';
import _isEmpty from 'lodash/isEmpty';
import { Popover, PopoverProps, Skeleton, Space } from 'antd';
import { useCachedUserInfo, useCachedOnlineStatus } from 'tailchat-shared';
import clsx from 'clsx';

interface UserListItemProps {
  userId: string;
  popover?: PopoverProps['content'];
  actions?: React.ReactElement[];
  hideDiscriminator?: boolean;
}
export const UserListItem: React.FC<UserListItemProps> = React.memo((props) => {
  const { actions = [], hideDiscriminator = false } = props;
  const userInfo = useCachedUserInfo(props.userId);
  const [isOnline] = useCachedOnlineStatus([props.userId]);
  const userName = userInfo.nickname;

  return (
    <div className="flex items-center h-14 px-2.5 rounded group bg-black bg-opacity-0 hover:bg-opacity-20 dark:bg-white dark:bg-opacity-0 dark:hover:bg-opacity-20">
      <Skeleton
        loading={_isEmpty(userInfo)}
        avatar={true}
        title={false}
        active={true}
      >
        <div className="mr-2">
          <Popover content={props.popover} placement="left" trigger="click">
            <Avatar
              className={clsx({
                'cursor-pointer': !!props.popover,
              })}
              src={userInfo.avatar}
              name={userName}
              isOnline={isOnline}
            />
          </Popover>
        </div>
        <div className="flex-1 text-gray-900 dark:text-white">
          <span>{userName}</span>
          {!hideDiscriminator && (
            <span className="text-gray-500 dark:text-gray-300 opacity-0 group-hover:opacity-100">
              #{userInfo.discriminator}
            </span>
          )}
        </div>
        <Space>{actions}</Space>
      </Skeleton>
    </div>
  );
});
UserListItem.displayName = 'UserListItem';
