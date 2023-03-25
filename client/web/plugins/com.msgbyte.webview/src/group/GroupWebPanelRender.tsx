import React from 'react';
import { Translate } from '../translate';
import { WebviewKeepAlive } from '@capital/component';
import urlRegex from 'url-regex';

const GroupWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  let url = String(panelInfo?.meta?.url);
  if (
    !url.includes('://') &&
    urlRegex({ exact: true, strict: false }).test(url)
  ) {
    // 不包含协议, 但是是个网址
    url = 'https://' + url;
  }

  return (
    <WebviewKeepAlive key={String(url)} className="w-full h-full" url={url} />
  );
};
GroupWebPanelRender.displayName = 'GroupWebPanelRender';

export default GroupWebPanelRender;
