import React from 'react';
import { t } from 'tailchat-shared';
import { Spinner } from './Spinner';

interface LoadingSpinnerProps {
  tip?: string;
}
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(
  (props) => {
    return (
      <div>
        <Spinner />
        {props.tip ?? t('加载中...')}
      </div>
    );
  }
);
LoadingSpinner.displayName = 'LoadingSpinner';
