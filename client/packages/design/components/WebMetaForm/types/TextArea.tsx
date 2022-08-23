import React from 'react';
import { Input, Form } from 'antd';
import type { FastifyFormFieldComponent } from 'react-fastify-form';
import { getValidateStatus } from '../utils';

export const FastifyFormTextArea: FastifyFormFieldComponent = React.memo(
  (props) => {
    const { name, label, value, onChange, error, maxLength, placeholder } =
      props;

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
  }
);
FastifyFormTextArea.displayName = 'FastifyFormTextArea';
