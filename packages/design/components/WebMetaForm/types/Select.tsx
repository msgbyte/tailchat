import React, { useEffect } from 'react';
import { Select, Form } from 'antd';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import type { MetaFormFieldComponent } from 'meta-form';

const Option = Select.Option;

interface MetaFormSelectOptionsItem {
  label: string;
  value: string;
}

export const MetaFormSelect: MetaFormFieldComponent<{
  options: MetaFormSelectOptionsItem[];
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
MetaFormSelect.displayName = 'MetaFormSelect';
