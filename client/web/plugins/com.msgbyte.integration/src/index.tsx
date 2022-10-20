import { Loadable, regCustomPanel } from '@capital/common';
import { Translate } from './translate';

const PLUGIN_NAME = '第三方集成';

console.log(`Plugin ${PLUGIN_NAME} is loaded`);

regCustomPanel({
  position: 'groupdetail',
  name: 'com.msgbyte.integration/groupdetail',
  icon: '',
  label: Translate.groupdetail,
  render: Loadable(() => import('./IntegrationPanel')),
});
