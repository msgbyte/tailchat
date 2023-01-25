import {
  isValidStr,
  model,
  registerWithEmail,
  showSuccessToasts,
  t,
  useAsyncFn,
  useAsyncRequest,
} from 'tailchat-shared';
import React, { useState } from 'react';
import { string } from 'yup';
import { Icon } from 'tailchat-design';
import { useNavigate } from 'react-router';
import { setUserJWT } from '../../utils/jwt-helper';
import { setGlobalUserLoginInfo } from '../../utils/user-helper';
import { useSearchParam } from '@/hooks/useSearchParam';
import { useNavToView } from './utils';
import { EntryInput } from './components/Input';
import { SecondaryBtn } from './components/SecondaryBtn';
import { PrimaryBtn } from './components/PrimaryBtn';
import { getGlobalConfig } from 'tailchat-shared/model/config';

/**
 * 注册视图
 */
export const RegisterView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [sendedEmail, setSendedEmail] = useState(false);
  const navigate = useNavigate();
  const navRedirect = useSearchParam('redirect');

  const [{ loading, error }, handleRegister] = useAsyncFn(async () => {
    await string()
      .email(t('邮箱格式不正确'))
      .required(t('邮箱不能为空'))
      .max(40, t('邮箱最长限制40个字符'))
      .validate(email);

    await string()
      .min(6, t('密码不能低于6位'))
      .required(t('密码不能为空'))
      .max(40, t('密码最长限制40个字符'))
      .validate(password);

    const data = await registerWithEmail(email, password, emailOTP);

    setGlobalUserLoginInfo(data);
    await setUserJWT(data.token);

    if (isValidStr(navRedirect)) {
      navigate(decodeURIComponent(navRedirect));
    } else {
      navigate('/main');
    }
  }, [email, password, emailOTP, navRedirect]);

  const [{ loading: sendEmailLoading }, handleSendEmail] =
    useAsyncRequest(async () => {
      await model.user.verifyEmail(email);
      showSuccessToasts(t('发送成功, 请检查你的邮箱。'));
      setSendedEmail(true);
    }, [email]);

  const navToView = useNavToView();

  return (
    <div className="w-96 text-white">
      <div className="mb-4 text-2xl">{t('注册账号')}</div>

      <div>
        <div className="mb-4">
          <div className="mb-2">{t('邮箱')}</div>
          <EntryInput
            name="reg-email"
            placeholder="name@example.com"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {getGlobalConfig().emailVerification && (
          <>
            {!sendedEmail && (
              <PrimaryBtn loading={sendEmailLoading} onClick={handleSendEmail}>
                {t('向邮箱发送校验码')}
              </PrimaryBtn>
            )}

            <div className="mb-4">
              <div className="mb-2">{t('邮箱校验码')}</div>
              <EntryInput
                name="reg-email-otp"
                type="text"
                placeholder="6位校验码"
                value={emailOTP}
                onChange={(e) => setEmailOTP(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <div className="mb-2">{t('密码')}</div>
          <EntryInput
            name="reg-password"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}

        <PrimaryBtn loading={loading} onClick={handleRegister}>
          {t('注册账号')}
        </PrimaryBtn>

        <SecondaryBtn
          className="text-left"
          disabled={loading}
          onClick={() => navToView('/entry/login')}
        >
          <Icon icon="mdi:arrow-left" className="mr-1 inline" />
          {t('返回登录')}
        </SecondaryBtn>
      </div>
    </div>
  );
});
RegisterView.displayName = 'RegisterView';
