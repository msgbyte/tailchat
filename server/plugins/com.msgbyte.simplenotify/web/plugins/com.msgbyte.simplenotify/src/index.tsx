import { regCustomPanel, Loadable, regInspectService } from '@capital/common';
import { Translate } from './translate';

regCustomPanel({
  position: 'groupdetail',
  name: 'com.msgbyte.simplenotify/groupSubscribe',
  label: Translate.groupSubscribe,
  render: Loadable(() => import('./GroupSubscribePanel')),
});

regInspectService({
  name: 'plugin:com.msgbyte.simplenotify',
  label: Translate.simplenotifyService,
});
