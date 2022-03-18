import { Icon } from '@/components/Icon';
import { Divider } from 'antd';
import { isValidStr, loginWithEmail, t, useAsyncFn } from 'tailchat-shared';
import React, { useState } from 'react';
import { Spinner } from '../../components/Spinner';
import { string } from 'yup';
import { useHistory } from 'react-router';
import { setUserJWT } from '../../utils/jwt-helper';
import { setGlobalUserLoginInfo } from '../../utils/user-helper';
import { useSearchParam } from '@/hooks/useSearchParam';
import { useNavToView } from './utils';

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
  const history = useHistory();
  const navRedirect = useSearchParam('redirect');

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

    if (isValidStr(navRedirect)) {
      history.push(decodeURIComponent(navRedirect));
    } else {
      history.push('/main');
    }
  }, [email, password, history, navRedirect]);

  const navToView = useNavToView();

  return (
    <div className="w-96 text-white">
      <div className="mb-4 text-2xl">{t('登录 Tailchat')}</div>

      <div>
        <div className="mb-4">
          <div className="mb-2">{t('邮箱')}</div>
          <input
            name="login-email"
            className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base sm:text-sm"
            placeholder="name@example.com"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <div className="mb-2">{t('密码')}</div>
          <input
            name="login-password"
            className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base sm:text-sm"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
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

        <button
          className="w-full py-2 px-4 mb-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={loading}
          onClick={handleLogin}
        >
          {loading && <Spinner />}
          {t('登录')}
        </button>

        <button
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none disabled:opacity-50"
          disabled={loading}
          onClick={() => navToView('/entry/register')}
        >
          {t('注册账号')}
          <Icon icon="mdi:arrow-right" className="ml-1 inline" />
        </button>

        <button
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none disabled:opacity-50"
          disabled={loading}
          onClick={() => navToView('/entry/guest')}
        >
          {t('游客访问')}
          <Icon icon="mdi:arrow-right" className="ml-1 inline" />
        </button>
      </div>
    </div>
  );
});
LoginView.displayName = 'LoginView';
