import React, { PropsWithChildren } from 'react';
import type { TagProps } from '../bbcode/type';

export const PlainText: React.FC<PropsWithChildren<TagProps>> = React.memo(
  (props) => (
    <pre style={{ display: 'inline', whiteSpace: 'break-spaces' }}>
      {props.children}
    </pre>
  )
);
PlainText.displayName = 'PlainText';
