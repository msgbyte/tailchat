import React, { useState, useCallback, useEffect } from 'react';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { Button, Input, Space } from 'antd';
import { Icon } from '@iconify/react';

export type FullModalFieldEditorRenderComponent = React.FC<{
  value: string;
  onChange: (val: string) => void;
}>;

interface FullModalFieldProps {
  /**
   * 字段标题
   */
  title: React.ReactNode;

  /**
   * 字段内容
   * 如果没有则向下取value的值
   */
  content?: React.ReactNode;

  /**
   * 是否可编辑
   */
  editable?: boolean;

  /**
   * 如果可编辑则必填
   * 用于告知组件当前的值
   */
  value?: string;

  /**
   * 渲染编辑视图的编辑器
   */
  renderEditor?: FullModalFieldEditorRenderComponent;

  /**
   * 编辑完成后的回调
   */
  onSave?: (val: string) => void;
}

/**
 * 字段编辑器
 */
const FullModalFieldEditor: React.FC<FullModalFieldProps> = React.memo(
  (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingValue, setEditingValue] = useState(props.value ?? '');

    useEffect(() => {
      setEditingValue(props.value ?? '');
    }, [props.value]);

    const handleEditing = useCallback(() => {
      setIsEditing(!isEditing);
    }, [isEditing]);

    const handleSave = useCallback(() => {
      props.onSave?.(editingValue);
      setIsEditing(false);
    }, [props.onSave, editingValue]);

    const EditorComponent = props.renderEditor;

    return (
      <Space className="flex w-full">
        {isEditing && !_isNil(EditorComponent) ? (
          <EditorComponent value={editingValue} onChange={setEditingValue} />
        ) : (
          <span>{props.content ?? props.value}</span>
        )}

        <Button
          icon={
            isEditing ? (
              <Icon className="anticon" icon="mdi:close" />
            ) : (
              <Icon className="anticon" icon="mdi:square-edit-outline" />
            )
          }
          onClick={handleEditing}
        />

        {isEditing && (
          <Button
            type="primary"
            icon={<Icon className="anticon" icon="mdi:check" />}
            onClick={handleSave}
          />
        )}
      </Space>
    );
  }
);
FullModalFieldEditor.displayName = 'FullModalFieldEditor';

export const FullModalField: React.FC<FullModalFieldProps> = React.memo(
  (props) => {
    const valueTitle = _isString(props.value) ? props.value : undefined;

    const allowEditor = props.editable === true && !_isNil(props.renderEditor);

    return (
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">{props.title}</div>
        <div className="h-10 text-base truncate">
          {allowEditor === true ? (
            <FullModalFieldEditor {...props} />
          ) : (
            <span title={valueTitle}>{props.content ?? props.value}</span>
          )}
        </div>
      </div>
    );
  }
);
FullModalField.displayName = 'FullModalField';

/**
 * 默认的输入框字段编辑器
 */
export const DefaultFullModalInputEditorRender: FullModalFieldEditorRenderComponent =
  ({ value, onChange }) => (
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  );

/**
 * 默认的多行输入框字段编辑器
 */
export const DefaultFullModalTextAreaEditorRender: FullModalFieldEditorRenderComponent =
  ({ value, onChange }) => (
    <Input.TextArea
      autoSize={true}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
