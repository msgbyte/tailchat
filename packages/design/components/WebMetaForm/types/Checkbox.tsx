import React from 'react';
import { Form, Checkbox } from 'antd';
import type { MetaFormFieldComponent } from 'meta-form';
import { getValidateStatus } from '../utils';

export const MetaFormCheckbox: MetaFormFieldComponent = React.memo((props) => {
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
MetaFormCheckbox.displayName = 'MetaFormCheckbox';
