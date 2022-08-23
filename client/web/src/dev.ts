import { isDevelopment, request, version } from 'tailchat-shared';
import { measure } from './utils/measure-helper';

if (isDevelopment === true) {
  (window as any).DEBUG = {
    request,
    version,
    measure,
  };
}
