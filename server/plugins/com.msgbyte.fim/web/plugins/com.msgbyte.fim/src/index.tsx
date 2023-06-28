import { regLoginAction } from '@capital/common';
import { FimAction } from './FimAction';

console.log('Plugin Federated Identity Management is loaded');

regLoginAction({
  name: 'fim',
  component: FimAction,
});
