import React from 'react';
import { regGroupPanel } from '@capital/common';
import { Translate } from './translate';
import _get from 'lodash/get';

const PLUGIN_NAME = 'com.msgbyte.webview';

const GroupWebPanelRender: React.FC<{ panelInfo: any }> = (props) => {
  const panelInfo = props.panelInfo;

  if (!panelInfo) {
    return <div>{Translate.notfound}</div>;
  }

  const url = _get(panelInfo, 'meta.url');

  return (
    <iframe key={String(url)} className="w-full h-full bg-white" src={url} />
  );
};

regGroupPanel({
  name: `${PLUGIN_NAME}/webpanel`,
  label: Translate.webpanel,
  provider: PLUGIN_NAME,
  extraFormMeta: [{ type: 'text', name: 'url', label: '网址' }],
  render: GroupWebPanelRender,
});
