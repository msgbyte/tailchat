import { Spinner } from '@/components/Spinner';
import { useSearchParam } from '@/hooks/useSearchParam';
import { setUserJWT } from '@/utils/jwt-helper';
import { setGlobalUserLoginInfo } from '@/utils/user-helper';
import { Icon } from '@/components/Icon';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  createTemporaryUser,
  isValidStr,
  t,
  useAsyncRequest,
} from 'tailchat-shared';
import { string } from 'yup';
import { useNavToView } from './utils';

export const GuestView: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const navToView = useNavToView();
  const navRedirect = useSearchParam('redirect');
  const [nickname, setNickname] = useState('');

  const [{ loading }, handleCreateTemporaryUser] = useAsyncRequest(async () => {
    await string().required(t('昵称不能为空')).max(16).validate(nickname);

    const data = await createTemporaryUser(nickname);

    setGlobalUserLoginInfo(data);
    await setUserJWT(data.token);

    if (isValidStr(navRedirect)) {
      navigate(decodeURIComponent(navRedirect));
    } else {
      navigate('/main');
    }
  }, [nickname, history, navRedirect]);

  return (
    <div className="w-96 text-white">
      <div className="mb-4 text-2xl">{t('创建访客')}</div>

      <div>
        <div className="mb-4">
          <div className="mb-2">{t('昵称')}</div>
          <input
            className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base mobile:text-sm"
            placeholder={t('想要让大家如何称呼你')}
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <button
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={loading}
          onClick={handleCreateTemporaryUser}
        >
          {loading && <Spinner />}
          {t('立即进入')}
        </button>

        <button
          className="w-full py-2 px-4 border border-transparent text-sm text-left font-medium text-white disabled:opacity-50"
          disabled={loading}
          onClick={() => navToView('/entry/login')}
        >
          <Icon icon="mdi:arrow-left" className="mr-1 inline" />
          {t('返回登录')}
        </button>
      </div>
    </div>
  );
});
GuestView.displayName = 'GuestView';
