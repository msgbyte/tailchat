import { regCustomPanel, regGroupPanel } from '@capital/common';
import { Loadable } from '@capital/component';
import { useIconIsShow } from './navbar/useIconIsShow';
import { Translate } from './translate';

const PLUGIN_ID = 'com.msgbyte.livekit';

console.log(`Plugin ${PLUGIN_ID} is loaded`);

regGroupPanel({
  name: `${PLUGIN_ID}/livekitPanel`,
  label: Translate.voiceChannel,
  provider: PLUGIN_ID,
  render: Loadable(() => import('./group/LivekitPanel'), {
    componentName: `${PLUGIN_ID}:LivekitPanel`,
  }),
});

regCustomPanel({
  position: 'navbar-more',
  icon: 'mingcute:voice-line',
  name: `${PLUGIN_ID}/livekitNavbarIcon`,
  label: Translate.toVoiceChannel,
  render: Loadable(
    () =>
      import('./navbar/redirect').then(
        (module) => module.LivekitNavbarRedirect
      ),
    {
      componentName: `${PLUGIN_ID}:LivekitNavbarRedirect`,
    }
  ),
  useIsShow: useIconIsShow,
});
