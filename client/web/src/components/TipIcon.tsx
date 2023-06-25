import React from 'react';
import { Icon } from 'tailchat-design';
import { DelayTip } from './DelayTip';

export const TipIcon: React.FC<{
  content: React.ReactNode;
}> = React.memo(({ content }) => {
  return (
    <DelayTip overlay={content}>
      <Icon icon="mdi:alert-circle-outline" className="cursor-help" />
    </DelayTip>
  );
});
TipIcon.displayName = 'TipIcon';
