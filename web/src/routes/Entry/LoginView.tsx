import React from 'react';
import { FastFormFieldMeta } from 'pawchat-shared';
import { WebFastForm } from '../../components/WebFastForm';
import { useCallback } from 'react';

const fields: FastFormFieldMeta[] = [
  {
    type: 'text',
    name: 'email',
    label: '邮箱',
  },
  {
    type: 'password',
    name: 'password',
    label: '密码',
  },
];

export const LoginView: React.FC = React.memo(() => {
  const handleLogin = useCallback((values) => {
    console.log('values', values);
  }, []);

  return (
    <div className="w-96 text-white">
      <div className="text-xl">登录 Paw Chat</div>

      <WebFastForm layout="vertical" fields={fields} onSubmit={handleLogin} />
    </div>
  );
});
LoginView.displayName = 'LoginView';
