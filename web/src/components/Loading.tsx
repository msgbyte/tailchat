import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingProps {
  spinning: boolean;
}
export const Loading: React.FC<LoadingProps> = React.memo((props) => {
  const { spinning = false } = props;

  return (
    <div className="relative">
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
