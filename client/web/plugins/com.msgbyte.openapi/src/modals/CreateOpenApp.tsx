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
import { Translate } from '../translate';

const schema = createFastFormSchema({
  appName: fieldSchema
    .string()
    .required(Translate.appNameCannotBeEmpty)
    .max(20, Translate.appNameTooLong),
  appDesc: fieldSchema.string(),
});

const fields = [
  { type: 'text', name: 'appName', label: Translate.app.appName },
  {
    type: 'textarea',
    name: 'appDesc',
    label: Translate.app.appDesc,
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

        showToasts(Translate.createApplicationSuccess, 'success');
        props.onSuccess?.();
      } catch (e) {
        showErrorToasts(e);
      }
    };

    return (
      <ModalWrapper title={Translate.createApplication}>
        <WebFastForm schema={schema} fields={fields} onSubmit={handleSubmit} />
      </ModalWrapper>
    );
  }
);
CreateOpenApp.displayName = 'CreateOpenApp';
