import React from 'react';
import { Form } from 'antd';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import type {
  FastFormFieldComponent,
  FastFormFieldProps,
} from 'tailchat-shared';
import { CustomField } from 'tailchat-shared';

export const FastFormCustom: FastFormFieldComponent<{
  render: (props: FastFormFieldProps) => React.ReactNode;
}> = React.memo((props) => {
  const { label } = props;

  return (
    <Form.Item label={label}>
      <CustomField {...props} />
    </Form.Item>
  );
});
FastFormCustom.displayName = 'FastFormCustom';
