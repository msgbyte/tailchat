import React, { useCallback } from 'react';
import { Avatar } from './Avatar';
import _isNil from 'lodash/isNil';
import { Skeleton, Space } from 'antd';
// import { openUserProfile } from './modals/UserProfile';
import { useCachedUserInfo } from 'pawchat-shared';

// const UserAvatar = styled(Avatar)`
//   cursor: pointer !important;
//   margin-right: 10px !important;
// `;

// const UserNameText = styled(Typography)`
//   flex: 1;
//   color: ${(props) => props.theme.color.headerPrimary} !important;
// `;

interface UserListItemProps {
  userId: string;
  actions?: React.ReactElement[];
}
export const UserListItem: React.FC<UserListItemProps> = React.memo((props) => {
  const { actions = [] } = props;
  const userInfo = useCachedUserInfo(props.userId);
  const userName = userInfo.nickname;

  const handleClick = useCallback(() => {
    console.log('clicked avatar');
  }, []);

  return (
    <div className="flex items-center h-14 px-2.5 rounded group bg-white bg-opacity-0 hover:bg-opacity-20">
      <Skeleton
        loading={_isNil(userInfo)}
        avatar={true}
        title={false}
        active={true}
      >
        <div className="mr-2" onClick={handleClick}>
          <Avatar src={userInfo.avatar} name={userName} />
        </div>
        <div className="flex-1 text-white">
          <span>{userName}</span>
          <span className="text-gray-300 opacity-0 group-hover:opacity-100">
            #{userInfo.discriminator}
          </span>
        </div>
        <Space>{...actions}</Space>
      </Skeleton>
    </div>
  );
});
UserListItem.displayName = 'UserListItem';
