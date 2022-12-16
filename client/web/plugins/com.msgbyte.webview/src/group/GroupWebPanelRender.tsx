import React from 'react';
import { Translate } from '../translate';
import { Webview } from '@capital/component';

const GroupWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  const url = panelInfo?.meta?.url;

  return <Webview key={String(url)} className="w-full h-full" url={url} />;
};
GroupWebPanelRender.displayName = 'GroupWebPanelRender';

export default GroupWebPanelRender;
