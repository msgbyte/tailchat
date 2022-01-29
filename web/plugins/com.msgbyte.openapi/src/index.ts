import { Loadable, regCustomPanel } from '@capital/common';
import { Translate } from './translate';

regCustomPanel({
  position: 'setting',
  icon: '',
  name: 'com.msgbyte.openapi/mainPanel',
  label: Translate.openapi,
  render: Loadable(() => import('./MainPanel')),
});
