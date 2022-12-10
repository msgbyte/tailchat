import React from 'react';
import { Typography } from 'antd';
import type { BlockProps } from 'antd/lib/typography/Base';

interface CopyableTextProps extends React.PropsWithChildren {
  className?: string;
  style?: React.CSSProperties;
  config?: BlockProps['copyable'];
}

/**
 * 可复制的文本
 */
export const CopyableText: React.FC<CopyableTextProps> = React.memo((props) => {
  return (
    <Typography.Text
      className={props.className}
      style={props.style}
      copyable={props.config ?? true}
    >
      {props.children}
    </Typography.Text>
  );
});
CopyableText.displayName = 'CopyableText';
