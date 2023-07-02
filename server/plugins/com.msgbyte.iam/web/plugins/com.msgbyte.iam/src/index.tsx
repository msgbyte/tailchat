import { regLoginAction } from '@capital/common';
import { IAMAction } from './IAMAction';

console.log('Plugin Identity and Access Management is loaded');

regLoginAction({
  name: 'plugin:com.msgbyte.iam/loginAction',
  component: IAMAction,
});
