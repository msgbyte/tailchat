import React from 'react';
import _get from 'lodash/get';
import type { LinkMeta } from './types';
import { parseUrlStr } from '@capital/common';
import { Image, Icon } from '@capital/component';

export const UrlMetaBase: React.FC<{
  meta: LinkMeta;
}> = React.memo(({ meta }) => {
  const imageUrl = _get(meta, 'images.0');
  const videoUrl = _get(meta, 'videos.0');

  return (
    <>
      <div className="basic">
        <div className="summary" onClick={() => window.open(meta.url)}>
          <div className="title">{_get(meta, 'title')}</div>
          <div className="description">{_get(meta, 'description')}</div>
        </div>
        {imageUrl && (
          <div className="image">
            <Image preview={true} src={parseUrlStr(imageUrl)} />
          </div>
        )}
      </div>
      {videoUrl && (
        <div className="video">
          <div
            className="openfull"
            onClick={(e) => {
              e.stopPropagation();
              window.open(videoUrl);
            }}
          >
            <Icon icon="mdi:open-in-new" />
          </div>
          <iframe src={videoUrl} />
        </div>
      )}
    </>
  );
});
UrlMetaBase.displayName = 'UrlMetaBase';
