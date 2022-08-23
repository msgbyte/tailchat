import React from 'react';
import { useAsync } from '@capital/common';
import { LoadingSpinner } from '@capital/component';
import { request } from '../request';
import _get from 'lodash/get';
import { UrlMetaBase } from './Base';
import type { LinkMeta } from './types';
import './index.less';
import { UrlMetaRender } from './render';

const metaCache: Record<string, LinkMeta | null> = {};

export const UrlMetaPreviewer: React.FC<{
  url: string;
}> = React.memo((props) => {
  const {
    error,
    value: meta,
    loading,
  } = useAsync(async () => {
    if (metaCache[props.url] !== undefined) {
      return metaCache[props.url];
    }

    try {
      const { data } = await request.post('fetch', {
        url: props.url,
      });

      metaCache[props.url] = data;

      return data;
    } catch (e) {
      console.warn('[linkmeta] fetch url meta info error', e);
      metaCache[props.url] = null;

      return null;
    }
  }, [props.url]);

  if (error || meta === null) {
    return null;
  }

  return loading ? (
    <div className="plugin-linkmeta-previewer">
      <LoadingSpinner />
    </div>
  ) : (
    <UrlMetaRender meta={meta} />
  );
});
UrlMetaPreviewer.displayName = 'UrlMetaPreviewer';
