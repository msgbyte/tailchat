import { regCustomPanel, Loadable } from '@capital/common';
import { Translate } from './translate';

regCustomPanel({
  position: 'personal',
  icon: 'akar-icons:game-controller',
  name: 'com.msgbyte.genshin/genshinPanel',
  label: Translate.genshin,
  render: Loadable(() => import('./GenshinPanel')),
});
