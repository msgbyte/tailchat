import React from 'react';
import { Avatar } from 'tailchat-design';
import _isEmpty from 'lodash/isEmpty';
import { Popover, PopoverProps, Skeleton, Space } from 'antd';
import { useCachedUserInfo, useCachedOnlineStatus } from 'tailchat-shared';
import { UserName } from './UserName';

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
          {props.popover ? (
            <Popover content={props.popover} placement="left" trigger="click">
              <Avatar
                className="cursor-pointer"
                src={userInfo.avatar}
                name={userName}
                isOnline={isOnline}
              />
            </Popover>
          ) : (
            <Avatar src={userInfo.avatar} name={userName} isOnline={isOnline} />
          )}
        </div>
        <div className="flex-1 text-gray-900 dark:text-white">
          <UserName
            userId={props.userId}
            showDiscriminator={!hideDiscriminator}
          />
        </div>
        <Space>{actions}</Space>
      </Skeleton>
    </div>
  );
});
UserListItem.displayName = 'UserListItem';
