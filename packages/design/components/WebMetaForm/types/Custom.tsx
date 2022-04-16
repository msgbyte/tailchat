import React from 'react';
import { Form } from 'antd';
import type { MetaFormFieldComponent, MetaFormFieldProps } from 'meta-form';
import { CustomField } from 'meta-form';

export const MetaFormCustom: MetaFormFieldComponent<{
  render: (props: MetaFormFieldProps) => React.ReactNode;
}> = React.memo((props) => {
  const { label } = props;

  return (
    <Form.Item label={label}>
      <CustomField {...props} />
    </Form.Item>
  );
});
MetaFormCustom.displayName = 'MetaFormCustom';
