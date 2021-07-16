import React from 'react';
import { Alert } from 'antd';

/**
 * 用于接口错误显示的组件
 */
export const AlertErrorView: React.FC<{
  error: Error;
}> = React.memo((props) => {
  return (
    <Alert
      type="error"
      message={String(props.error.name)}
      description={String(props.error.message)}
    />
  );
});
AlertErrorView.displayName = 'AlertErrorView';
