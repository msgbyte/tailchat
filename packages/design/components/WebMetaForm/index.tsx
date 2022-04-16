import React, { useMemo } from 'react';
import {
  MetaForm,
  regField,
  MetaFormContainerComponent,
  regFormContainer,
} from 'meta-form';
import { Form, Button } from 'antd';

import { MetaFormText } from './types/Text';
import { MetaFormTextArea } from './types/TextArea';
import { MetaFormPassword } from './types/Password';
import { MetaFormSelect } from './types/Select';
import { MetaFormCheckbox } from './types/Checkbox';
import { MetaFormCustom } from './types/Custom';

regField('text', MetaFormText);
regField('textarea', MetaFormTextArea);
regField('password', MetaFormPassword);
regField('select', MetaFormSelect);
regField('checkbox', MetaFormCheckbox);
regField('custom', MetaFormCustom);

const WebMetaFormContainer: MetaFormContainerComponent = React.memo((props) => {
  const layout = props.layout;
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
          {props.submitLabel ?? '提交'}
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
      {submitButtonRender}
    </Form>
  );
});
WebMetaFormContainer.displayName = 'WebMetaFormContainer';
regFormContainer(WebMetaFormContainer);

export const WebMetaForm = MetaForm;
WebMetaForm.displayName = 'WebMetaForm';
