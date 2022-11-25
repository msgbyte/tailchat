import React from 'react';
import _get from 'lodash/get';
import type { LinkMeta } from './types';
import { UrlMetaBase } from './Base';
import { UrlMetaVideo } from './Video';
import { UrlMetaImage } from './Image';
import { UrlMetaAudio } from './Audio';

export const UrlMetaRender: React.FC<{
  meta: LinkMeta;
}> = React.memo(({ meta }) => {
  const contentType = _get(meta, 'contentType', '');
  if (contentType.startsWith('video/')) {
    return (
      <div className="plugin-linkmeta-previewer">
        <UrlMetaVideo meta={meta} />
      </div>
    );
  }

  if (contentType.startsWith('image/')) {
    return (
      <div className="plugin-linkmeta-previewer">
        <UrlMetaImage meta={meta} />
      </div>
    );
  }

  if (contentType.startsWith('audio/')) {
    return (
      <div className="plugin-linkmeta-previewer">
        <UrlMetaAudio meta={meta} />
      </div>
    );
  }

  if (contentType.startsWith('application/')) {
    return null;
  }

  // 一般网页
  return (
    <div className="plugin-linkmeta-previewer">
      <UrlMetaBase meta={meta} />
    </div>
  );
});
UrlMetaRender.displayName = 'UrlMetaRender';
