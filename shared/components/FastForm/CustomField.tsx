import React from 'react';
import type { FastFormFieldComponent, FastFormFieldProps } from './field';

export const CustomField: FastFormFieldComponent<{
  render: (props: FastFormFieldProps) => React.ReactNode;
}> = React.memo((props) => {
  const { render, ...others } = props;

  return <>{render(others)}</>;
});
CustomField.displayName = 'CustomField';
