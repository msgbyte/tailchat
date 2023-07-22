import { regCustomPanel } from '@capital/common';
import { Loadable } from '@capital/component';
import { Translate } from './translate';

const PLUGIN_ID = 'com.msgbyte.music';

console.log(`Plugin ${PLUGIN_ID} is loaded`);

regCustomPanel({
  position: 'navbar-more',
  icon: 'mdi:disc-player',
  name: `${PLUGIN_ID}/musicpanel`,
  label: Translate.musicpanel,
  render: Loadable(
    () => import('./panels/MusicPanel').then((module) => module.MusicPanel),
    {
      componentName: `${PLUGIN_ID}:CustomMusicPanelRender`,
    }
  ),
});
