import { Icon } from '@iconify/react';
import { Divider } from 'antd';
import { useAsyncFn } from 'pawchat-shared';
import React, { useState } from 'react';
import { Spinner } from '../../components/Spinner';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [{ value, loading }, handleLogin] = useAsyncFn(async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('');
      }, 2000);
    });
    console.log({ username, password });
  }, [username, password]);

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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-8">
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

        <button
          className="group relative w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
