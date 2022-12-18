import React from 'react';
import { Translate } from '../translate';
import { WebviewKeepAlive } from '@capital/component';

const GroupWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  const url = panelInfo?.meta?.url;

  return (
    <WebviewKeepAlive key={String(url)} className="w-full h-full" url={url} />
  );
};
GroupWebPanelRender.displayName = 'GroupWebPanelRender';

export default GroupWebPanelRender;
