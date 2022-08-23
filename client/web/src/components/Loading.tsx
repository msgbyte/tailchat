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
      {spinning && (
        <div className="absolute inset-0 z-10 bg-white bg-opacity-20 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}

      {props.children}
    </div>
  );
});
Loading.displayName = 'Loading';
