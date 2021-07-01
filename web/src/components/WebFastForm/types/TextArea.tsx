import React from 'react';
import { Input, Form } from 'antd';
import type { FastFormFieldComponent } from 'pawchat-shared';
import { getValidateStatus } from '../utils';

export const FastFormTextArea: FastFormFieldComponent = React.memo((props) => {
  const { name, label, value, onChange, error, maxLength, placeholder } = props;

  return (
    <Form.Item
      label={label}
      validateStatus={getValidateStatus(error)}
      help={error}
    >
      <Input.TextArea
        name={name}
        rows={4}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Form.Item>
  );
});
FastFormTextArea.displayName = 'FastFormTextArea';
