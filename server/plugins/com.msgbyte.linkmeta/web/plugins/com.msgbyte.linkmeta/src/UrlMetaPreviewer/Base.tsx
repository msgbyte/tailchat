import React from 'react';
import _get from 'lodash/get';
import type { LinkMeta } from './types';
import { Image, Icon } from '@capital/component';

export const UrlMetaBase: React.FC<{
  meta: LinkMeta;
}> = React.memo(({ meta }) => {
  return (
    <>
      <div className="basic">
        <div className="summary" onClick={() => window.open(meta.url)}>
          <div className="title">{_get(meta, 'title')}</div>
          <div className="description">{_get(meta, 'description')}</div>
        </div>
        {_get(meta, 'images.0') && (
          <div className="image">
            <Image preview={true} src={_get(meta, 'images.0')} />
          </div>
        )}
      </div>
      {_get(meta, 'videos.0') && (
        <div className="video">
          <div
            className="openfull"
            onClick={(e) => {
              e.stopPropagation();
              window.open(_get(meta, 'videos.0'));
            }}
          >
            <Icon icon="mdi:open-in-new" />
          </div>
          <iframe src={_get(meta, 'videos.0')} />
        </div>
      )}
    </>
  );
});
UrlMetaBase.displayName = 'UrlMetaBase';
