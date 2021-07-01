import { Icon } from '@iconify/react';
import React from 'react';

interface LoadingSpinnerProps {
  tip?: string;
}
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(
  (props) => {
    return (
      <div>
        <Icon className="animate-spin h-5 w-5 mr-3" icon="mdi-loading" />
        {props.tip ?? 'Processing'}
      </div>
    );
  }
);
