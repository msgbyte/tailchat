import { Tag } from 'antd';
import React from 'react';
import { AvatarWithPreview } from 'tailchat-design';
import { t, UserBaseInfo } from 'tailchat-shared';

export const GroupUserPopover: React.FC<{
  userInfo: UserBaseInfo;
}> = React.memo((props) => {
  const { userInfo } = props;

  return (
    <div className="w-80">
      <AvatarWithPreview
        size={80}
        src={userInfo.avatar}
        name={userInfo.nickname}
      />
      <div className="text-xl mt-2">
        <span className="font-semibold">{userInfo.nickname}</span>
        <span className="opacity-60 ml-1">#{userInfo.discriminator}</span>
      </div>

      <div>
        {userInfo.temporary && <Tag color="processing">{t('游客')}</Tag>}
      </div>
    </div>
  );
});
GroupUserPopover.displayName = 'GroupUserPopover';
