import { UserName } from '@/components/UserName';
import { fetchImagePrimaryColor } from '@/utils/image-helper';
import { Space, Tag } from 'antd';
import React, { useEffect } from 'react';
import { t, UserBaseInfo } from 'tailchat-shared';
import { UserProfileContainer } from '../../UserProfileContainer';
import { usePluginUserExtraInfo } from './usePluginUserExtraInfo';

export const PersonalUserPopover: React.FC<{
  userInfo: UserBaseInfo;
}> = React.memo((props) => {
  const { userInfo } = props;
  const userExtra = userInfo.extra ?? {};
  const pluginUserExtraInfoEl = usePluginUserExtraInfo(userExtra);

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
          <span className="font-semibold">
            <UserName userId={userInfo._id} />
          </span>
          <span className="opacity-60 ml-1">#{userInfo.discriminator}</span>
        </div>

        <Space size={4} wrap={true} className="py-1">
          {userInfo.type === 'openapiBot' && (
            <Tag color="orange">{t('开放平台机器人')}</Tag>
          )}

          {userInfo.type === 'pluginBot' && (
            <Tag color="orange">{t('插件机器人')}</Tag>
          )}

          {userInfo.temporary && <Tag color="processing">{t('游客')}</Tag>}
        </Space>

        <div className="pt-2">{pluginUserExtraInfoEl}</div>
      </UserProfileContainer>
    </div>
  );
});
PersonalUserPopover.displayName = 'PersonalUserPopover';
