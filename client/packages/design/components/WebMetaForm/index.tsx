import React, { useMemo } from 'react';
import {
  FastifyForm,
  regField,
  FastifyFormContainerComponent,
  regFormContainer,
} from 'react-fastify-form';
import { Form, Button } from 'antd';

import { FastifyFormText } from './types/Text';
import { FastifyFormTextArea } from './types/TextArea';
import { FastifyFormPassword } from './types/Password';
import { FastifyFormSelect } from './types/Select';
import { FastifyFormCheckbox } from './types/Checkbox';
import { FastifyFormCustom } from './types/Custom';

regField('text', FastifyFormText);
regField('textarea', FastifyFormTextArea);
regField('password', FastifyFormPassword);
regField('select', FastifyFormSelect);
regField('checkbox', FastifyFormCheckbox);
regField('custom', FastifyFormCustom);

let webFastifyFormConfig = {
  submitLabel: 'Submit',
};

export function setWebFastifyFormConfig(config: typeof webFastifyFormConfig) {
  webFastifyFormConfig = {
    ...webFastifyFormConfig,
    ...config,
  };
}

const WebFastifyFormContainer: FastifyFormContainerComponent = React.memo(
  (props) => {
    const layout = props.layout;
    const suffixElement = props.extraProps?.suffixElement;

    const submitButtonRender = useMemo(() => {
      return (
        <Form.Item
          wrapperCol={
            layout === 'vertical'
              ? { xs: 24 }
              : { sm: 24, md: { span: 16, offset: 8 } }
          }
        >
          <Button
            loading={props.loading}
            type="primary"
            size="large"
            htmlType="button"
            style={{ width: '100%' }}
            onClick={() => props.handleSubmit()}
            disabled={props.canSubmit === false}
          >
            {props.submitLabel ?? webFastifyFormConfig.submitLabel}
          </Button>
        </Form.Item>
      );
    }, [
      props.loading,
      props.handleSubmit,
      props.canSubmit,
      props.submitLabel,
      layout,
    ]);

    return (
      <Form
        layout={layout}
        labelCol={layout === 'vertical' ? { xs: 24 } : { sm: 24, md: 8 }}
        wrapperCol={layout === 'vertical' ? { xs: 24 } : { sm: 24, md: 16 }}
      >
        {props.children}
        {suffixElement}
        {submitButtonRender}
      </Form>
    );
  }
);
WebFastifyFormContainer.displayName = 'WebFastifyFormContainer';
regFormContainer(WebFastifyFormContainer);

export const WebMetaForm = FastifyForm;
(WebMetaForm as any).displayName = 'WebMetaForm';
