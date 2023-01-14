import { Select, Switch } from 'antd';
import React from 'react';
import {
  DefaultFullModalInputEditorRender,
  DefaultFullModalTextAreaEditorRender,
  FullModalField,
} from './Field';

export type FullModalFactoryConfig = {
  name: string;
  label: string;
  desc?: string;
} & (
  | {
      type: 'text';
    }
  | {
      type: 'textarea';
    }
  | {
      type: 'boolean';
    }
  | {
      type: 'select';
      options: { label: string; value: string }[];
    }
);

interface FullModalFactoryProps<T = any> {
  value: T;
  onChange: (val: T) => void;
  config: FullModalFactoryConfig;
}

/**
 * 输入配置输出组件
 */
export const FullModalFactory: React.FC<FullModalFactoryProps> = React.memo(
  (props) => {
    const { value, onChange, config } = props;
    if (config.type === 'text') {
      return (
        <FullModalField
          title={config.label}
          value={value}
          editable={true}
          renderEditor={DefaultFullModalInputEditorRender}
          onSave={(val) => onChange(val)}
        />
      );
    }
    if (config.type === 'textarea') {
      return (
        <FullModalField
          title={config.label}
          value={value}
          editable={true}
          renderEditor={DefaultFullModalTextAreaEditorRender}
          onSave={(val) => onChange(val)}
        />
      );
    }

    if (config.type === 'boolean') {
      return (
        <FullModalField
          title={config.label}
          tip={config.desc}
          content={
            <Switch
              checked={value ?? false}
              onChange={(checked) => onChange(checked)}
            />
          }
        />
      );
    }

    if (config.type === 'select') {
      return (
        <FullModalField
          title={config.label}
          tip={config.desc}
          content={
            <Select
              style={{ width: 280 }}
              size="large"
              value={value}
              onChange={(val) => onChange(val)}
            >
              {config.options.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          }
        />
      );
    }

    return null;
  }
);
FullModalFactory.displayName = 'FullModalFactory';
