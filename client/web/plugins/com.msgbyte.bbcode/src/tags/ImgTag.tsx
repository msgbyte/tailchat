import React from 'react';
import { Image } from '@capital/component';
import type { TagProps } from '../bbcode/type';

const MAX_HEIGHT = 320;
const MAX_WIDTH = 320;

const imageStyle: React.CSSProperties = {
  maxHeight: MAX_HEIGHT,
  maxWidth: MAX_WIDTH,
  width: 'auto',
};

function parseImageAttr(attr: { height: string; width: string }): {
  height?: number;
  width?: number;
} {
  const height = Number(attr.height);
  const width = Number(attr.width);

  if (!(height > 0 && width > 0)) {
    // 确保宽高为数字且均大于0
    return {};
  }

  const ratio = Math.max(height / MAX_HEIGHT, width / MAX_WIDTH);

  return {
    height: height / ratio,
    width: width / ratio,
  };
}

export const ImgTag: React.FC<TagProps> = React.memo((props) => {
  const { node } = props;
  const text = node.content.join('');
  const url = node.attrs.url ?? text;

  return (
    <Image
      style={{
        ...imageStyle,
        ...parseImageAttr(node.attrs as any),
      }}
      preview={true}
      src={url}
    />
  );
});
ImgTag.displayName = 'ImgTag';
