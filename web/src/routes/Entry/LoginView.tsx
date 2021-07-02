import { Icon } from '@iconify/react';
import { Divider } from 'antd';
import { useAsyncFn } from 'pawchat-shared';
import React, { useState } from 'react';
import { Spinner } from '../../components/Spinner';
import { string } from 'yup';

/**
 * 第三方登录
 */
const OAuthLoginView: React.FC = React.memo(() => {
  // TODO
  return (
    <>
      <Divider>或</Divider>

      <div className="bg-gray-400 w-1/3 px-4 py-1 text-3xl text-center rounded-md cursor-pointer shadow-md">
        <Icon className="mx-auto" icon="mdi-github" />
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

  const [{ loading, error }, handleLogin] = useAsyncFn(async () => {
    console.log({ email, password });

    await string()
      .email('邮箱格式不正确')
      .required('邮箱不能为空')
      .validate(email);

    await string()
      .min(6, '密码不能低于6位')
      .required('密码不能为空')
      .validate(password);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('');
      }, 2000);
    });
  }, [email, password]);

  return (
    <div className="w-96 text-white">
      <div className="mb-4 text-2xl">登录 Paw Chat</div>

      <div>
        <div className="mb-4">
          <div className="mb-2">邮箱</div>
          <input
            id="email"
            className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base sm:text-sm"
            placeholder="name@example.com"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <div className="mb-2">密码</div>
          <input
            id="password"
            className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base sm:text-sm"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}

        <button
          className="group relative w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={loading}
          onClick={handleLogin}
        >
          {loading && <Spinner />}
          登录
        </button>
      </div>
    </div>
  );
});
LoginView.displayName = 'LoginView';
