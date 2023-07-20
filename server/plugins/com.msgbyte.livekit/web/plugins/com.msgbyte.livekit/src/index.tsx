import { regGroupPanel } from '@capital/common';
import { Loadable } from '@capital/component';
import { Translate } from './translate';

const PLUGIN_ID = 'com.msgbyte.livekit';

console.log('Plugin livekit is loaded');

regGroupPanel({
  name: `${PLUGIN_ID}/livekitPanel`,
  label: Translate.voiceChannel,
  provider: PLUGIN_ID,
  render: Loadable(() => import('./group/LivekitPanel'), {
    componentName: `${PLUGIN_ID}:LivekitPanel`,
  }),
});
