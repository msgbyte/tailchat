import React from 'react';
import { Input, Form } from 'antd';
import type { FastFormFieldComponent } from 'tailchat-shared';
import { getValidateStatus } from '../utils';

export const FastFormText: FastFormFieldComponent = React.memo((props) => {
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
FastFormText.displayName = 'FastFormText';
