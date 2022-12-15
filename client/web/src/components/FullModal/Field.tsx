import React, { useState, useCallback, useEffect } from 'react';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { Input, Space } from 'antd';
import { t } from 'tailchat-shared';
import { DelayTip } from '../DelayTip';
import { IconBtn } from '../IconBtn';
import { TipIcon } from '../TipIcon';

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
   * 提示信息
   */
  tip?: React.ReactNode;

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
 * 计算要显示的title
 */
function useTitle(value?: string) {
  return _isString(value) ? value : undefined;
}

/**
 * 字段编辑器
 */
const FullModalFieldEditor: React.FC<FullModalFieldProps> = React.memo(
  (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingValue, setEditingValue] = useState(props.value ?? '');
    const valueTitle = useTitle(props.value);

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
      <div className="flex w-full">
        {/* 内容 */}
        <div className="truncate">
          {isEditing && !_isNil(EditorComponent) ? (
            <EditorComponent value={editingValue} onChange={setEditingValue} />
          ) : (
            <span className="select-text" title={valueTitle}>
              {props.content ?? props.value}
            </span>
          )}
        </div>

        {/* 操作 */}
        <div className="ml-2">
          {!isEditing ? (
            <DelayTip title={t('编辑')}>
              <IconBtn
                size="small"
                icon="mdi:square-edit-outline"
                onClick={handleEditing}
              />
            </DelayTip>
          ) : (
            <Space>
              <DelayTip title={t('取消')}>
                <IconBtn
                  size="small"
                  icon="mdi:close"
                  onClick={handleEditing}
                />
              </DelayTip>
              <DelayTip title={t('保存变更')}>
                <IconBtn
                  type="primary"
                  size="small"
                  icon="mdi:check"
                  onClick={handleSave}
                />
              </DelayTip>
            </Space>
          )}
        </div>
      </div>
    );
  }
);
FullModalFieldEditor.displayName = 'FullModalFieldEditor';

export const FullModalField: React.FC<FullModalFieldProps> = React.memo(
  (props) => {
    const valueTitle = useTitle(props.value);

    const allowEditor = props.editable === true && !_isNil(props.renderEditor);

    return (
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2 flex items-center">
          <span>{props.title}</span>
          {props.tip && (
            <span className="ml-1 text-sm">
              <TipIcon content={props.tip} />
            </span>
          )}
        </div>
        <div className="min-h-10 text-base truncate">
          {allowEditor === true ? (
            <FullModalFieldEditor {...props} />
          ) : (
            <span className="select-text" title={valueTitle}>
              {props.content ?? props.value}
            </span>
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
      autoSize={{ minRows: 2, maxRows: 6 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
