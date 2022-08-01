import React from 'react';
import { Form } from 'antd';
import type {
  FastifyFormFieldComponent,
  FastifyFormFieldProps,
} from 'react-fastify-form';
import { CustomField } from 'react-fastify-form';

export const FastifyFormCustom: FastifyFormFieldComponent<{
  render: (props: FastifyFormFieldProps) => React.ReactNode;
}> = React.memo((props) => {
  const { label } = props;

  return (
    <Form.Item label={label}>
      <CustomField {...props} />
    </Form.Item>
  );
});
FastifyFormCustom.displayName = 'FastifyFormCustom';
