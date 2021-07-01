import React, { useEffect } from 'react';
import { Select, Form } from 'antd';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import type { FastFormFieldComponent } from 'pawchat-shared';

const Option = Select.Option;

interface FastFormSelectOptionsItem {
  label: string;
  value: string;
}

export const FastFormSelect: FastFormFieldComponent<{
  options: FastFormSelectOptionsItem[];
}> = React.memo((props) => {
  const { name, label, value, onChange, options } = props;

  useEffect(() => {
    if (_isNil(value) || value === '') {
      // 如果没有值的话则自动设置默认值
      onChange(_get(options, [0, 'value']));
    }
  }, []);

  return (
    <Form.Item label={label}>
      <Select size="large" value={value} onChange={(value) => onChange(value)}>
        {options.map((option, i) => (
          <Option key={`${option.value}${i}`} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
});
FastFormSelect.displayName = 'FastFormSelect';
