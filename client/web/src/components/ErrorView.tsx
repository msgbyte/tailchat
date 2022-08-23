import React from 'react';
import { Problem } from './Problem';

/**
 * 用于接口错误显示的组件
 */
export const ErrorView: React.FC<{
  error: Error;
}> = React.memo(({ error }) => {
  return <Problem text={String(error.message ?? error.name ?? error)} />;
});
ErrorView.displayName = 'ErrorView';
