import { registerWithEmail, useAsyncFn } from 'pawchat-shared';
import React, { useCallback, useState } from 'react';
import { Spinner } from '../../components/Spinner';
import { string } from 'yup';
import { Icon } from '@iconify/react';
import { useHistory } from 'react-router';

/**
 * 注册视图
 */
export const RegisterView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const [{ loading, error }, handleRegister] = useAsyncFn(async () => {
    await string()
      .email('邮箱格式不正确')
      .required('邮箱不能为空')
      .validate(email);

    await string()
      .min(6, '密码不能低于6位')
      .required('密码不能为空')
      .validate(password);

    const data = await registerWithEmail(email, password);

    // TODO
    console.log(data);
  }, [email, password]);

  const toLoginView = useCallback(() => {
    history.push('/entry/login');
  }, [history]);

  return (
    <div className="w-96 text-white">
      <div className="mb-4 text-2xl">注册账号</div>

      <div>
        <div className="mb-4">
          <div className="mb-2">邮箱</div>
          <input
            name="reg-email"
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
            name="reg-password"
            className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base sm:text-sm"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}

        <button
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={loading}
          onClick={handleRegister}
        >
          {loading && <Spinner />}
          注册账号
        </button>

        <button
          className="w-full py-2 px-4 border border-transparent text-sm text-left font-medium text-white disabled:opacity-50"
          disabled={loading}
          onClick={toLoginView}
        >
          <Icon icon="mdi-arrow-left" className="mr-1 inline" />
          返回登录
        </button>
      </div>
    </div>
  );
});
RegisterView.displayName = 'RegisterView';
