import React from 'react';
import type { MetaFormFieldComponent, MetaFormFieldProps } from './field';

export const CustomField: MetaFormFieldComponent<{
  render: (props: MetaFormFieldProps) => React.ReactNode;
}> = React.memo((props) => {
  const { render, ...others } = props;

  return <>{render(others)}</>;
});
CustomField.displayName = 'CustomField';
