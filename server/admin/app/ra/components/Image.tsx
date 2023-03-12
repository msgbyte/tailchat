import React, { ImgHTMLAttributes } from 'react';
import { parseUrlStr } from '../utils';

export const Image: React.FC<ImgHTMLAttributes<HTMLImageElement>> = React.memo(
  (props) => {
    return <img {...props} src={parseUrlStr(props.src)} />;
  }
);
Image.displayName = 'Image';
