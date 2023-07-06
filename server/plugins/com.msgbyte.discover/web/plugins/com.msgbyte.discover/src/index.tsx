import { regCustomPanel, Loadable } from '@capital/common';
import { Translate } from './translate';

console.log('Plugin Discover is loaded');

const DiscoverPanel = Loadable(() =>
  import('./DiscoverPanel').then((m) => m.DiscoverPanel)
);

regCustomPanel({
  position: 'navbar-group',
  icon: 'mdi:compass',
  name: 'plugin:com.msgbyte.discover/entry',
  label: Translate.discover,
  render: DiscoverPanel,
});
