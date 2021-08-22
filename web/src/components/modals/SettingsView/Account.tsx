import { Avatar } from '@/components/Avatar';
import { AvatarUploader } from '@/components/AvatarUploader';
import {
  DefaultFullModalInputEditorRender,
  FullModalField,
} from '@/components/FullModal/Field';
import React from 'react';
import {
  modifyUserField,
  showToasts,
  t,
  UploadFileResult,
  useAppDispatch,
  useAsyncRequest,
  userActions,
  useUserInfo,
} from 'tailchat-shared';

export const SettingsAccount: React.FC = React.memo(() => {
  const userInfo = useUserInfo();
  const dispatch = useAppDispatch();

  const [, handleUserAvatarChange] = useAsyncRequest(
    async (fileInfo: UploadFileResult) => {
      await modifyUserField('avatar', fileInfo.url);
      dispatch(
        userActions.setUserInfoField({
          fieldName: 'avatar',
          fieldValue: fileInfo.url,
        })
      );
      showToasts(t('修改头像成功'), 'success');
    },
    []
  );

  const [, handleUpdateNickName] = useAsyncRequest(
    async (newNickname: string) => {
      await modifyUserField('nickname', newNickname);
      dispatch(
        userActions.setUserInfoField({
          fieldName: 'nickname',
          fieldValue: newNickname,
        })
      );
      showToasts(t('修改头像成功'), 'success');
    },
    []
  );

  if (!userInfo) {
    return null;
  }

  return (
    <div className="flex">
      <div className="w-1/3">
        <AvatarUploader onUploadSuccess={handleUserAvatarChange}>
          <Avatar size={128} src={userInfo.avatar} name={userInfo.nickname} />
        </AvatarUploader>
      </div>
      <div className="w-2/3">
        <FullModalField
          title={t('用户昵称')}
          value={userInfo.nickname}
          editable={true}
          renderEditor={DefaultFullModalInputEditorRender}
          onSave={handleUpdateNickName}
        />
      </div>
    </div>
  );
});
SettingsAccount.displayName = 'SettingsAccount';
