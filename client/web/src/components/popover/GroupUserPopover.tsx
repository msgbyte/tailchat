import { fetchImagePrimaryColor } from '@/utils/image-helper';
import { Tag } from 'antd';
import React, { useEffect } from 'react';
import { t, UserBaseInfo } from 'tailchat-shared';
import { UserProfileContainer } from '../UserProfileContainer';

export const GroupUserPopover: React.FC<{
  userInfo: UserBaseInfo;
}> = React.memo((props) => {
  const { userInfo } = props;

  useEffect(() => {
    if (userInfo.avatar) {
      fetchImagePrimaryColor(userInfo.avatar).then((rgba) => {
        console.log('fetchImagePrimaryColor', rgba);
      });
    }
  }, [userInfo.avatar]);

  return (
    <div className="w-80 -mx-4 -my-3 bg-inherit">
      <UserProfileContainer userInfo={userInfo}>
        <div className="text-xl">
          <span className="font-semibold">{userInfo.nickname}</span>
          <span className="opacity-60 ml-1">#{userInfo.discriminator}</span>
        </div>

        <div>
          {userInfo.temporary && <Tag color="processing">{t('游客')}</Tag>}
        </div>
      </UserProfileContainer>
    </div>
  );
});
GroupUserPopover.displayName = 'GroupUserPopover';
