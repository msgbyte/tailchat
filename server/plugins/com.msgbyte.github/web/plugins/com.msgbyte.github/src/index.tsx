import {
  regCustomPanel,
  regInspectService,
  regPluginPermission,
  regPluginRootRoute,
  isDevelopment,
} from '@capital/common';
import { Loadable } from '@capital/component';
import { Translate } from './translate';

const PLUGIN_ID = 'com.msgbyte.github';

regCustomPanel({
  position: 'groupdetail',
  name: `${PLUGIN_ID}/groupSubscribe`,
  label: Translate.groupSubscribe,
  render: Loadable(() => import('./GroupSubscribePanel')),
});

regInspectService({
  name: `plugin:${PLUGIN_ID}.subscribe`,
  label: Translate.githubService,
});

regPluginPermission({
  key: `plugin.${PLUGIN_ID}.subscribe.manage`,
  title: Translate.permissionTitle,
  desc: Translate.permissionDesc,
  default: false,
});

if (isDevelopment) {
  regPluginRootRoute({
    name: `plugin:${PLUGIN_ID}/route`,
    path: '/github/:owner/:repo',
    component: Loadable(() =>
      import('./components/GithubRepoInfo').then((m) => m.GithubRepoInfoRoute)
    ),
  });
}
