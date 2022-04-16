import React from 'react';
import { Input, Form } from 'antd';
import type { MetaFormFieldComponent } from 'meta-form';
import { getValidateStatus } from '../utils';

export const MetaFormText: MetaFormFieldComponent = React.memo((props) => {
  const { name, label, value, onChange, error, maxLength, placeholder } = props;

  return (
    <Form.Item
      label={label}
      validateStatus={getValidateStatus(error)}
      help={error}
    >
      <Input
        name={name}
        size="large"
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Form.Item>
  );
});
MetaFormText.displayName = 'MetaFormText';
