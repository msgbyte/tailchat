import { fetchImagePrimaryColor } from '@/utils/image-helper';
import React, { PropsWithChildren } from 'react';
import { AvatarWithPreview, getTextColorHex } from 'tailchat-design';
import { useAsync, UserBaseInfo } from 'tailchat-shared';

/**
 * 用户信息容器
 */
export const UserProfileContainer: React.FC<
  PropsWithChildren<{ userInfo: UserBaseInfo }>
> = React.memo((props) => {
  const { userInfo } = props;

  const { value: bannerColor } = useAsync(async () => {
    if (!userInfo.avatar) {
      return getTextColorHex(userInfo.nickname);
    }

    const rgba = await fetchImagePrimaryColor(userInfo.avatar);
    return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
  }, [userInfo.avatar]);

  return (
    <div className="relative bg-inherit">
      <div
        style={{
          width: '100%',
          height: 60,
          backgroundColor: bannerColor,
        }}
      />

      <div className="absolute p-1 rounded-1/2 -mt-11 ml-3 bg-inherit">
        <AvatarWithPreview
          size={80}
          src={userInfo.avatar}
          name={userInfo.nickname}
        />
      </div>

      <div className="p-2 mt-10">{props.children}</div>
    </div>
  );
});
UserProfileContainer.displayName = 'UserProfileContainer';
