import React from 'react';
import '../../../../src/styles';
import clsx from 'clsx';

export const TestWrapper: React.FC<{
  theme?: 'dark' | 'light';
}> = (props) => {
  const { theme = 'dark' } = props;

  return (
    <div
      className={clsx(theme, {
        'bg-black': theme === 'dark',
      })}
      data-testid="test-wrapper"
    >
      {props.children}
    </div>
  );
};
TestWrapper.displayName = 'TestWrapper';
