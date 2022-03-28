import { Icon } from './Icon';
import React from 'react';
import { DelayTip } from './DelayTip';

export const TipIcon: React.FC<{
  content: React.ReactNode;
}> = React.memo(({ content }) => {
  return (
    <DelayTip overlay={content}>
      <Icon icon="mdi:alert-circle-outline" />
    </DelayTip>
  );
});
TipIcon.displayName = 'TipIcon';
