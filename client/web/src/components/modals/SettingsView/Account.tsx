import { AvatarUploader } from '@/components/AvatarUploader';
import {
  DefaultFullModalInputEditorRender,
  FullModalField,
} from '@/components/FullModal/Field';
import { openModal } from '@/components/Modal';
import { closeModal, pluginUserExtraInfo } from '@/plugin/common';
import { getGlobalSocket } from '@/utils/global-state-helper';
import { setUserJWT } from '@/utils/jwt-helper';
import { setGlobalUserLoginInfo } from '@/utils/user-helper';
import { Button, Divider, Typography } from 'antd';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Avatar } from 'tailchat-design';
import {
  model,
  modifyUserField,
  showSuccessToasts,
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
  const navigate = useNavigate();
  const userExtra = userInfo?.extra ?? {};

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

  const [, handleUpdateExtraInfo] = useAsyncRequest(
    async (fieldName: string, fieldValue: unknown) => {
      await model.user.modifyUserExtra(fieldName, fieldValue);
      dispatch(
        userActions.setUserInfoExtra({
          fieldName,
          fieldValue,
        })
      );
      showSuccessToasts(t('修改成功'));
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
    navigate('/');
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

          {pluginUserExtraInfo.map((item, i) => {
            if (item.component && item.component.editor) {
              const Component = item.component.editor;
              return (
                <Component
                  key={item.name + i}
                  value={userExtra[item.name]}
                  onSave={(val) => handleUpdateExtraInfo(item.name, val)}
                />
              );
            }

            return (
              <FullModalField
                key={item.name + i}
                title={item.label}
                value={userExtra[item.name] ? String(userExtra[item.name]) : ''}
                editable={true}
                renderEditor={DefaultFullModalInputEditorRender}
                onSave={(val) => handleUpdateExtraInfo(item.name, val)}
              />
            );
          })}
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
