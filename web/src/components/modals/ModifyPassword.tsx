import React from 'react';
import {
  createFastFormSchema,
  FastFormFieldMeta,
  fieldSchema,
  modifyUserPassword,
  showToasts,
  t,
  useAsyncRequest,
} from 'tailchat-shared';
import { ModalWrapper } from '../Modal';
import { WebFastForm } from '../WebFastForm';

interface Values {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

const fields: FastFormFieldMeta[] = [
  {
    type: 'password',
    name: 'oldPassword',
    label: t('旧密码'),
  },
  {
    type: 'password',
    name: 'newPassword',
    label: t('新密码'),
  },
  {
    type: 'password',
    name: 'newPasswordRepeat',
    label: t('重复密码'),
  },
];

const schema = createFastFormSchema({
  oldPassword: fieldSchema
    .string()
    .min(6, t('密码不能低于6位'))
    .required(t('密码不能为空')),
  newPassword: fieldSchema
    .string()
    .min(6, t('密码不能低于6位'))
    .required(t('密码不能为空')),
  newPasswordRepeat: fieldSchema
    .string()
    .min(6, t('密码不能低于6位'))
    .required(t('密码不能为空')),
});

interface ModifyPasswordProps {
  onSuccess?: () => void;
}
export const ModifyPassword: React.FC<ModifyPasswordProps> = React.memo(
  (props) => {
    const [{}, handleModifyPassword] = useAsyncRequest(
      async (values: Values) => {
        if (values.newPassword !== values.newPasswordRepeat) {
          showToasts(t('新旧密码不匹配'), 'warning');
          return;
        }

        await modifyUserPassword(values.oldPassword, values.newPassword);
        showToasts(t('密码修改成功'), 'success');

        typeof props.onSuccess === 'function' && props.onSuccess();
      },
      [props.onSuccess]
    );

    return (
      <ModalWrapper title={t('修改密码')}>
        <WebFastForm
          schema={schema}
          fields={fields}
          onSubmit={handleModifyPassword}
        />
      </ModalWrapper>
    );
  }
);
ModifyPassword.displayName = 'ModifyPassword';
