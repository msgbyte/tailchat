import { Loadable, regGroupPanel } from '@capital/common';
import { Translate } from './translate';

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
  ],
  render: Loadable(() => import('./group/GroupWebPanelRender')),
  menus: [
    {
      name: 'openInNewWindow',
      label: Translate.openInExtra,
      icon: 'mdi:web',
      onClick: (panelInfo) => {
        if (panelInfo.meta?.url) {
          window.open(String(panelInfo.meta?.url));
        }
      },
    },
  ],
});

regGroupPanel({
  name: `${PLUGIN_NAME}/customwebpanel`,
  label: Translate.customwebpanel,
  provider: PLUGIN_NAME,
  extraFormMeta: [
    {
      type: 'textarea',
      name: 'html',
      label: Translate.htmlcode,
      placeholder: Translate.customwebpanelPlaceholder,
    },
  ],
  render: Loadable(() => import('./group/GroupCustomWebPanelRender'), {
    componentName: 'com.msgbyte.webview:GroupCustomWebPanelRender',
  }),
});
