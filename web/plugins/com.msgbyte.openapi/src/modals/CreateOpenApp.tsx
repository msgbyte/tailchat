import {
  createFastFormSchema,
  fieldSchema,
  ModalWrapper,
  postRequest,
  showToasts,
  showErrorToasts,
} from '@capital/common';
import { WebFastForm } from '@capital/component';
import React from 'react';

const schema = createFastFormSchema({
  appName: fieldSchema
    .string()
    .required('应用名不能为空')
    .max(20, '应用名过长'),
  appDesc: fieldSchema.string(),
});

const fields = [
  { type: 'text', name: 'appName', label: '应用名' },
  {
    type: 'textarea',
    name: 'appDesc',
    label: '应用描述',
  },
];

interface CreateOpenAppProps {
  onSuccess?: () => void;
}
export const CreateOpenApp: React.FC<CreateOpenAppProps> = React.memo(
  (props) => {
    const handleSubmit = async (values: any) => {
      try {
        await postRequest('/openapi/app/create', {
          ...values,
          appIcon: '',
        });

        showToasts('应用创建成功', 'success');
        props.onSuccess?.();
      } catch (e) {
        showErrorToasts(e);
      }
    };

    return (
      <ModalWrapper title="创建应用">
        <WebFastForm schema={schema} fields={fields} onSubmit={handleSubmit} />
      </ModalWrapper>
    );
  }
);
CreateOpenApp.displayName = 'CreateOpenApp';
