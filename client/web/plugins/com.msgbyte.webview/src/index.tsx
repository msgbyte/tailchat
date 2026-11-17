import { isSafeUrl, Loadable, regGroupPanel } from '@capital/common';
import { Translate } from './translate';
import { normalizePanelUrl } from './url';

const PLUGIN_NAME = 'com.msgbyte.webview';

regGroupPanel({
  name: `${PLUGIN_NAME}/grouppanel`,
  label: Translate.webpanel,
  provider: PLUGIN_NAME,
  extraFormMeta: [
    {
      type: 'text',
      name: 'url',
      label: Translate.website,
    },
    {
      type: 'checkbox',
      name: 'background',
      label: Translate.addBackground,
    },
  ],
  render: Loadable(() => import('./group/GroupWebPanelRender')),
  menus: [
    {
      name: 'openInNewWindow',
      label: Translate.openInExtra,
      icon: 'mdi:web',
      onClick: (panelInfo) => {
        if (!panelInfo.meta?.url) {
          return;
        }
        const url = normalizePanelUrl(String(panelInfo.meta.url));
        if (isSafeUrl(url)) {
          // noopener: 不让被打开的页面通过 window.opener 篡改当前页
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      },
    },
  ],
});

regGroupPanel({
  name: `${PLUGIN_NAME}/customwebpanel`,
  label: Translate.customwebpanel,
  provider: PLUGIN_NAME,
  render: Loadable(() => import('./group/GroupCustomWebPanelRender'), {
    componentName: `${PLUGIN_NAME}:GroupCustomWebPanelRender`,
  }),
});
