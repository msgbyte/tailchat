import React, { useEffect } from 'react';
import { Form, Checkbox } from 'antd';
import type { FastifyFormFieldComponent } from 'react-fastify-form';
import { getValidateStatus } from '../utils';

export const FastifyFormCheckbox: FastifyFormFieldComponent = React.memo(
  (props) => {
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
  }
);
FastifyFormCheckbox.displayName = 'FastifyFormCheckbox';
