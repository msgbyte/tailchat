import { Icon } from 'tailchat-design';
import { Divider } from 'antd';
import {
  isValidStr,
  loginWithEmail,
  t,
  useAsyncFn,
  useGlobalConfigStore,
} from 'tailchat-shared';
import React, { useEffect, useState } from 'react';
import { string } from 'yup';
import { useLocation, useNavigate } from 'react-router';
import { setUserJWT } from '../../utils/jwt-helper';
import { setGlobalUserLoginInfo, tryAutoLogin } from '../../utils/user-helper';
import { useSearchParam } from '@/hooks/useSearchParam';
import { useNavToView } from './utils';
import { IconBtn } from '@/components/IconBtn';
import { openModal } from '@/components/Modal';
import { ServiceUrlSettings } from '@/components/modals/ServiceUrlSettings';
import { LanguageSelect } from '@/components/LanguageSelect';
import { EntryInput } from './components/Input';
import { SecondaryBtn } from './components/SecondaryBtn';
import { PrimaryBtn } from './components/PrimaryBtn';
import { pluginLoginAction } from '@/plugin/common';

/**
 * TODO:
 * 第三方登录
 */
const OAuthLoginView: React.FC = React.memo(() => {
  return (
    <>
      <Divider>{t('或')}</Divider>

      <div className="bg-gray-400 w-1/3 px-4 py-1 text-3xl text-center rounded-md cursor-pointer shadow-md">
        <Icon className="mx-auto" icon="mdi:github" />
      </div>
    </>
  );
});
OAuthLoginView.displayName = 'OAuthLoginView';

/**
 * 登录视图
 */
export const LoginView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const navRedirect = useSearchParam('redirect');
  const { pathname } = useLocation();
  const { serverName, disableGuestLogin, disableUserRegister } =
    useGlobalConfigStore((state) => ({
      serverName: state.serverName,
      disableGuestLogin: state.disableGuestLogin,
      disableUserRegister: state.disableUserRegister,
    }));

  useEffect(() => {
    tryAutoLogin()
      .then(() => {
        navigate('/main');
      })
      .catch(() => {});
  }, []);

  const [{ loading, error }, handleLogin] = useAsyncFn(async () => {
    await string()
      .email(t('邮箱格式不正确'))
      .required(t('邮箱不能为空'))
      .validate(email);

    await string()
      .min(6, t('密码不能低于6位'))
      .required(t('密码不能为空'))
      .validate(password);

    const data = await loginWithEmail(email, password);

    setGlobalUserLoginInfo(data);
    await setUserJWT(data.token);

    if (isValidStr(navRedirect) && navRedirect !== pathname) {
      // 增加非当前状态判定避免循环
      navigate(decodeURIComponent(navRedirect));
    } else {
      navigate('/main');
    }
  }, [email, password, navRedirect, pathname, navigate]);

  const navToView = useNavToView();

  return (
    <div className="w-96 text-white relative">
      <div className="mb-4 text-2xl">
        {t('登录 {{serverName}}', {
          serverName: serverName || 'Tailchat',
        })}
      </div>

      <div>
        <div className="mb-4">
          <div className="mb-2">{t('邮箱')}</div>
          <EntryInput
            name="login-email"
            placeholder="name@example.com"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <div className="mb-2">{t('密码')}</div>
          <EntryInput
            name="login-password"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {loading === false && error && (
          <div className="flex justify-between mb-4">
            <p className="text-red-500 text-sm">{error.message}</p>
            <div
              className="text-gray-200 cursor-pointer"
              onClick={() => navToView('/entry/forget')}
            >
              {t('忘记密码？')}
            </div>
          </div>
        )}

        <PrimaryBtn loading={loading} onClick={handleLogin}>
          {t('登录')}
        </PrimaryBtn>

        {!disableUserRegister && (
          <SecondaryBtn
            disabled={loading}
            onClick={() => navToView('/entry/register')}
          >
            {t('注册账号')}
            <Icon icon="mdi:arrow-right" className="ml-1 inline" />
          </SecondaryBtn>
        )}

        {!disableGuestLogin && (
          <SecondaryBtn
            disabled={loading}
            onClick={() => navToView('/entry/guest')}
          >
            {t('游客访问')}
            <Icon icon="mdi:arrow-right" className="ml-1 inline" />
          </SecondaryBtn>
        )}

        {pluginLoginAction.map((item) => {
          const { name, component: Component } = item;

          return <Component key={name} />;
        })}
      </div>

      <div className="absolute bottom-4 left-0 space-x-2">
        <IconBtn
          icon="mdi:cog"
          shape="square"
          onClick={() => openModal(<ServiceUrlSettings />)}
        />

        <LanguageSelect size="middle" />
      </div>
    </div>
  );
});
LoginView.displayName = 'LoginView';
