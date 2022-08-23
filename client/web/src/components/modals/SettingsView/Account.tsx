import { Avatar } from '@/components/Avatar';
import { AvatarUploader } from '@/components/AvatarUploader';
import {
  DefaultFullModalInputEditorRender,
  FullModalField,
} from '@/components/FullModal/Field';
import { openModal } from '@/components/Modal';
import { closeModal } from '@/plugin/common';
import { getGlobalSocket } from '@/utils/global-state-helper';
import { setUserJWT } from '@/utils/jwt-helper';
import { setGlobalUserLoginInfo } from '@/utils/user-helper';
import { Button, Divider, Typography } from 'antd';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
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
import { ModifyPassword } from '../ModifyPassword';

export const SettingsAccount: React.FC = React.memo(() => {
  const userInfo = useUserInfo();
  const dispatch = useAppDispatch();
  const history = useHistory();

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

  const handleUpdatePassword = useCallback(() => {
    const key = openModal(<ModifyPassword onSuccess={() => closeModal(key)} />);
  }, []);

  // 登出
  const handleLogout = useCallback(async () => {
    await setUserJWT(null);
    getGlobalSocket()?.disconnect();
    setGlobalUserLoginInfo(null);
    history.push('/');
  }, []);

  if (!userInfo) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-wrap">
        <div className="w-1/3 mobile:w-full">
          <AvatarUploader
            className="text-4xl"
            circle={true}
            onUploadSuccess={handleUserAvatarChange}
          >
            <Avatar size={128} src={userInfo.avatar} name={userInfo.nickname} />
          </AvatarUploader>
        </div>
        <div className="w-2/3 mobile:w-full">
          <FullModalField
            title={t('用户昵称')}
            value={userInfo.nickname}
            editable={true}
            renderEditor={DefaultFullModalInputEditorRender}
            onSave={handleUpdateNickName}
          />
        </div>
      </div>

      <Divider />

      <Typography.Title level={4}>{t('密码')}</Typography.Title>
      <Button type="primary" onClick={handleUpdatePassword}>
        {t('修改密码')}
      </Button>

      <Divider />

      <div>
        <Button type="primary" danger={true} onClick={handleLogout}>
          {t('退出登录')}
        </Button>
      </div>
    </div>
  );
});
SettingsAccount.displayName = 'SettingsAccount';
