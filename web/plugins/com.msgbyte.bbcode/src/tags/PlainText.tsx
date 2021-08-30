import React from 'react';
import type { TagProps } from '../bbcode/type';

export const PlainText: React.FC<TagProps> = React.memo((props) => (
  <pre style={{ display: 'inline' }}>{props.children}</pre>
));
PlainText.displayName = 'PlainText';
