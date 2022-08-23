import React from 'react';
import _get from 'lodash/get';
import type { LinkMeta } from './types';

export const UrlMetaVideo: React.FC<{
  meta: LinkMeta;
}> = React.memo(({ meta }) => {
  return <video src={meta.url} controls={true} />;
});
UrlMetaVideo.displayName = 'UrlMetaVideo';
