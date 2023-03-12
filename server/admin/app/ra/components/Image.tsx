import React from 'react';
import { parseUrlStr } from '../utils';

export const Image: React.FC<{ src: string }> = React.memo((props) => {
  return <img src={parseUrlStr(props.src)} />;
});
Image.displayName = 'Image';
