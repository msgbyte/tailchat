import React from 'react';
import { regGroupPanel, useCurrentGroupPanelInfo } from '@capital/common';
import { Translate } from './translate';

const PLUGIN_NAME = 'com.msgbyte.webview';

const GroupWebPanelRender = () => {
  const groupPanelInfo = useCurrentGroupPanelInfo();

  if (!groupPanelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  const url = groupPanelInfo.meta?.url;

  return (
    <iframe key={String(url)} className="w-full h-full bg-white" src={url} />
  );
};

regGroupPanel({
  name: `${PLUGIN_NAME}/grouppanel`,
  label: Translate.webpanel,
  provider: PLUGIN_NAME,
  extraFormMeta: [{ type: 'text', name: 'url', label: '网址' }],
  render: GroupWebPanelRender,
});
