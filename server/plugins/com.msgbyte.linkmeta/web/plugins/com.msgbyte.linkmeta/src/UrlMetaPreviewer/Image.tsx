import React from 'react';
import _get from 'lodash/get';
import { Image } from '@capital/component';
import type { LinkMeta } from './types';

const MAX_HEIGHT = 320;
const MAX_WIDTH = 320;

export const UrlMetaImage: React.FC<{
  meta: LinkMeta;
}> = React.memo(({ meta }) => {
  return (
    <Image
      preview={true}
      src={meta.url}
      style={{
        maxHeight: MAX_HEIGHT,
        maxWidth: MAX_WIDTH,
        width: 'auto',
      }}
    />
  );
});
UrlMetaImage.displayName = 'UrlMetaImage';
