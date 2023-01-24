import { pluginUserExtraInfo } from '@/plugin/common';
import { fetchImagePrimaryColor } from '@/utils/image-helper';
import { Space, Tag } from 'antd';
import React, { useEffect } from 'react';
import { getTextColorHex } from 'tailchat-design';
import { GroupInfo, t, UserBaseInfo } from 'tailchat-shared';
import { UserProfileContainer } from '../UserProfileContainer';

export const GroupUserPopover: React.FC<{
  userInfo: UserBaseInfo;
  groupInfo: GroupInfo;
  hideDiscriminator?: boolean;
}> = React.memo((props) => {
  const { userInfo, groupInfo, hideDiscriminator = false } = props;
  const userExtra = userInfo.extra ?? {};
  const roleNames = getUserRoleNames(userInfo._id, groupInfo);

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
          {!hideDiscriminator && (
            <span className="opacity-60 ml-1">#{userInfo.discriminator}</span>
          )}
        </div>

        <Space size={4} wrap={true} className="py-1">
          {groupInfo.owner === userInfo._id && (
            <Tag color="gold">{t('创建者')}</Tag>
          )}

          {userInfo.temporary && <Tag color="processing">{t('游客')}</Tag>}

          {roleNames.map((name) => (
            <Tag key={name} color={getTextColorHex(name)}>
              {name}
            </Tag>
          ))}
        </Space>

        <div className="pt-2">
          {pluginUserExtraInfo.map((item, i) => {
            const Component = item.component?.render;
            if (Component) {
              // 自定义渲染方式
              return (
                <Component key={item.name + i} value={userExtra[item.name]} />
              );
            }

            // 默认渲染方式
            return (
              <div key={item.name + i} className="flex">
                <div className="w-1/4 text-gray-500">{item.label}:</div>
                <div className="w-3/4">
                  {userExtra[item.name] ? String(userExtra[item.name]) : ''}
                </div>
              </div>
            );
          })}
        </div>
      </UserProfileContainer>
    </div>
  );
});
GroupUserPopover.displayName = 'GroupUserPopover';

/**
 * 获取用户的角色名列表
 */
function getUserRoleNames(userId: string, groupInfo: GroupInfo) {
  const roles = groupInfo.members.find((m) => m.userId === userId)?.roles ?? [];
  const roleNames = groupInfo.roles
    .filter((r) => roles.includes(r._id))
    .map((r) => r.name);

  return roleNames;
}
