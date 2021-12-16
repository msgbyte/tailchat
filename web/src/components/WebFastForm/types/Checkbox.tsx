import React from 'react';
import { Form, Checkbox } from 'antd';
import type { FastFormFieldComponent } from 'tailchat-shared';
import { getValidateStatus } from '../utils';

export const FastFormCheckbox: FastFormFieldComponent = React.memo((props) => {
  const { name, label, value, onChange, error } = props;

  return (
    <Form.Item
      label={label}
      validateStatus={getValidateStatus(error)}
      help={error}
    >
      <Checkbox
        name={name}
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
      >
        {label}
      </Checkbox>
    </Form.Item>
  );
});
FastFormCheckbox.displayName = 'FastFormCheckbox';
