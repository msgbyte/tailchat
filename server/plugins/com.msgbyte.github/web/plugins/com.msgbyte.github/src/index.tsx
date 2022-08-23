import { regCustomPanel, Loadable, regInspectService } from '@capital/common';
import { Translate } from './translate';

regCustomPanel({
  position: 'groupdetail',
  name: 'com.msgbyte.github/groupSubscribe',
  label: Translate.groupSubscribe,
  render: Loadable(() => import('./GroupSubscribePanel')),
});

regInspectService({
  name: 'plugin:com.msgbyte.github.subscribe',
  label: Translate.githubService,
});
