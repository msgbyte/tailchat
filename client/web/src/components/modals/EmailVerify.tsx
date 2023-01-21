import { setUserJWT } from '@/utils/jwt-helper';
import { setGlobalUserLoginInfo } from '@/utils/user-helper';
import React, { useMemo, useState } from 'react';
import {
  model,
  showErrorToasts,
  showSuccessToasts,
  t,
  useAppDispatch,
  useAsyncRequest,
  userActions,
  useUserInfo,
} from 'tailchat-shared';
import {
  createMetaFormSchema,
  MetaFormFieldMeta,
  metaFormFieldSchema,
  WebMetaForm,
  FastifyFormFieldProps,
  useFastifyFormContext,
} from 'tailchat-design';
import { ModalWrapper } from '../Modal';
import { Button, Input } from 'antd';
import _compact from 'lodash/compact';
import { getGlobalConfig } from 'tailchat-shared/model/config';
import { Problem } from '../Problem';

interface Values {
  emailOTP: string;
  [key: string]: unknown;
}

const fields: MetaFormFieldMeta[] = [
  {
    type: 'text',
    name: 'emailOTP',
    placeholder: t('6位校验码'),
    label: t('邮箱校验码'),
  },
];

const schema = createMetaFormSchema({
  emailOTP: metaFormFieldSchema
    .string()
    .length(6, t('校验码为6位'))
    .required(t('校验码不能为空')),
});

export const EmailVerify: React.FC<{
  onSuccess?: () => void;
}> = React.memo((props) => {
  const dispatch = useAppDispatch();
  const [sended, setSended] = useState(false);
  const userInfo = useUserInfo();

  const [{ loading }, handleSendEmail] = useAsyncRequest(async () => {
    if (!userInfo) {
      return;
    }

    await model.user.verifyEmail(userInfo.email);
    setSended(true);
  }, [userInfo?.email]);

  const [, handleVerifyEmail] = useAsyncRequest(
    async (values: Values) => {
      const data = await model.user.verifyEmailWithOTP(values.emailOTP);

      setGlobalUserLoginInfo(data);
      dispatch(userActions.setUserInfo(data));

      showSuccessToasts(t('邮箱验证通过'));

      if (typeof props.onSuccess === 'function') {
        props.onSuccess();
      }
    },
    [userInfo?.email, props.onSuccess]
  );

  if (!userInfo) {
    return <Problem />;
  }

  return (
    <ModalWrapper title={t('认证邮箱')}>
      {!sended ? (
        <>
          <Button
            className="mb-2"
            type="primary"
            block={true}
            size="large"
            loading={loading}
            onClick={handleSendEmail}
          >
            {t('向 {{email}} 发送认证邮件', {
              email: userInfo.email,
            })}
          </Button>
          <Button
            type="text"
            block={true}
            size="large"
            onClick={() => setSended(true)}
          >
            {t('已发送认证邮件')}
          </Button>
        </>
      ) : (
        <WebMetaForm
          schema={schema}
          fields={fields}
          onSubmit={handleVerifyEmail}
        />
      )}
    </ModalWrapper>
  );
});
EmailVerify.displayName = 'EmailVerify';
