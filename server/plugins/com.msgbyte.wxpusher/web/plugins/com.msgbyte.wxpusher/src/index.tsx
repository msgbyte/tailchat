import { regCustomPanel } from '@capital/common';
import { Loadable } from '@capital/component';

console.log('Plugin wxpusher is loaded');

regCustomPanel({
  position: 'setting',
  icon: '',
  name: 'com.msgbyte.wxpusher/settings',
  label: 'WxPusher',
  render: Loadable(() => import('./SettingsPanel')),
});
