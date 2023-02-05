import { regCustomPanel } from '@capital/common';
import { Loadable } from '@capital/component';
import { Translate } from './translate';

const PLUGIN_NAME = 'com.msgbyte.music';

console.log(`Plugin ${PLUGIN_NAME} is loaded`);

regCustomPanel({
  position: 'navbar-more',
  icon: 'mdi:disc-player',
  name: `${PLUGIN_NAME}/musicpanel`,
  label: Translate.musicpanel,
  render: Loadable(
    () => import('./panels/MusicPanel').then((module) => module.MusicPanel),
    {
      componentName: `${PLUGIN_NAME}:CustomMusicPanelRender`,
    }
  ),
});
