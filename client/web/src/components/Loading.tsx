import clsx from 'clsx';
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface LoadingProps {
  spinning: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export const Loading: React.FC<LoadingProps> = React.memo((props) => {
  const { spinning = false, className, style } = props;

  return (
    <div className={clsx('relative', className)} style={style}>
      <div
        className={clsx(
          'absolute inset-0 z-10 bg-white bg-opacity-20 flex justify-center items-center transition-opacity duration-100',
          {
            'opacity-0 pointer-events-none': !spinning,
            'opacity-100': spinning,
          }
        )}
      >
        <LoadingSpinner />
      </div>

      {props.children}
    </div>
  );
});
Loading.displayName = 'Loading';
