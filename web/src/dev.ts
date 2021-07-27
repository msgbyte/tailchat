import { isDevelopment, request } from 'tailchat-shared';

if (isDevelopment === true) {
  (window as any).DEBUG = {
    request,
  };
}
