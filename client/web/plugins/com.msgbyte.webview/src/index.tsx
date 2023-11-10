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
  render: Loadable(() => import('./group/GroupCustomWebPanelRender'), {
    componentName: `${PLUGIN_NAME}:GroupCustomWebPanelRender`,
  }),
});
