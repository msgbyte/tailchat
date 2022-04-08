import React from 'react';
import { Translate } from '../translate';

const GroupWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  const url = panelInfo?.meta?.url;

  return (
    <iframe key={String(url)} className="w-full h-full bg-white" src={url} />
  );
};
GroupWebPanelRender.displayName = 'GroupWebPanelRender';

export default GroupWebPanelRender;
