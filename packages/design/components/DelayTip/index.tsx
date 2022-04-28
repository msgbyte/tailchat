import { Tooltip, TooltipProps } from 'antd';
import React from 'react';

/**
 * 延时提示
 */
export const DelayTip: React.FC<TooltipProps> = React.memo((props) => {
  return (
    <Tooltip mouseEnterDelay={1} {...props}>
      {props.children}
    </Tooltip>
  );
});
DelayTip.displayName = 'DelayTip';
