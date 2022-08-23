import { Loadable, regCustomPanel, regPluginRootRoute } from '@capital/common';
import { Translate } from './translate';

const MainPanel = Loadable(() => import('./MainPanel'));

regCustomPanel({
  position: 'setting',
  icon: '',
  name: 'com.msgbyte.openapi/mainPanel',
  label: Translate.openapi,
  render: MainPanel,
});

regPluginRootRoute({
  name: 'com.msgbyte.openapi/route',
  path: '/openapi',
  component: MainPanel,
});
