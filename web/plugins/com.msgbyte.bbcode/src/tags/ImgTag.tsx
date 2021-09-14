import React from 'react';
import { Image } from '@capital/component';
import type { TagProps } from '../bbcode/type';

export const ImgTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');
  const url = node.attrs.url ?? text;

  return <Image preview={true} src={url} />;
});
ImgTag.displayName = 'ImgTag';
