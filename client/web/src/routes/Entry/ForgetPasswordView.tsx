import { Icon } from 'tailchat-design';
import {
  forgetPassword,
  resetPassword,
  showToasts,
  t,
  useAsyncRequest,
} from 'tailchat-shared';
import React, { useState } from 'react';
import { Spinner } from '../../components/Spinner';
import { string } from 'yup';
import { useNavToView } from './utils';
import { EntryInput } from './components/Input';
import { SecondaryBtn } from './components/SecondaryBtn';
import { PrimaryBtn } from './components/PrimaryBtn';

/**
 * 登录视图
 */
export const ForgetPasswordView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [sendedEmail, setSendedEmail] = useState(false);

  const navToView = useNavToView();

  const [{ loading: sendEmailLoading }, handleSendEmail] =
    useAsyncRequest(async () => {
      await forgetPassword(email);
      setSendedEmail(true);
      showToasts(`已发送邮件到 ${email}`, 'success');
    }, [email]);

  const [{ loading }, handleResetPassword] = useAsyncRequest(async () => {
    await string()
      .email(t('邮箱格式不正确'))
      .required(t('邮箱不能为空'))
      .validate(email);

    await string()
      .min(6, t('密码不能低于6位'))
      .required(t('密码不能为空'))
      .validate(password);

    await string().length(6, t('OTP为6位数字')).validate(otp);

    await resetPassword(email, password, otp);

    showToasts(t('密码重置成功，现在回到登录页'), 'success');
    navToView('/entry/login');
  }, [email, password, otp, navToView]);

  return (
    <div className="w-96 text-white">
      <div className="mb-4 text-2xl">{t('忘记密码')}</div>

      <div>
        <div className="mb-4">
          <div className="mb-2">{t('邮箱')}</div>
          <EntryInput
            name="forget-email"
            placeholder="name@example.com"
            type="text"
            disabled={sendedEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {!sendedEmail && (
          <PrimaryBtn loading={sendEmailLoading} onClick={handleSendEmail}>
            {t('向邮箱发送OTP')}
          </PrimaryBtn>
        )}

        {sendedEmail && (
          <>
            <div className="mb-4">
              <div className="mb-2">{t('OTP')}</div>
              <EntryInput
                name="forget-otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <div className="mb-2">{t('新密码')}</div>
              <EntryInput
                name="forget-password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <PrimaryBtn loading={loading} onClick={handleResetPassword}>
              {t('重设密码')}
            </PrimaryBtn>
          </>
        )}

        <SecondaryBtn
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
ForgetPasswordView.displayName = 'ForgetPasswordView';
