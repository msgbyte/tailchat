import React from 'react';
import { Input, Form } from 'antd';
import type { FastifyFormFieldComponent } from 'react-fastify-form';
import { getValidateStatus } from '../utils';

export const FastifyFormPassword: FastifyFormFieldComponent = React.memo(
  (props) => {
    const {
      name,
      label,
      value,
      onChange,
      onBlur,
      error,
      maxLength,
      placeholder,
    } = props;

    return (
      <Form.Item
        label={label}
        validateStatus={getValidateStatus(error)}
        help={error}
      >
        <Input.Password
          name={name}
          type="password"
          size="large"
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      </Form.Item>
    );
  }
);
FastifyFormPassword.displayName = 'FastifyFormPassword';
