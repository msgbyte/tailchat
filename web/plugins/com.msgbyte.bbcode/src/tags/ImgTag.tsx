import React from 'react';
import { Image } from '@capital/component';
import type { TagProps } from '../bbcode/type';

const imageStyle: React.CSSProperties = {
  maxHeight: 320,
  maxWidth: 320,
  width: 'auto',
};

export const ImgTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');
  const url = node.attrs.url ?? text;

  return <Image style={imageStyle} preview={true} src={url} />;
});
ImgTag.displayName = 'ImgTag';
