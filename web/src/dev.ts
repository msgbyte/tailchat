import { isDevelopment, request, version } from 'tailchat-shared';

if (isDevelopment === true) {
  (window as any).DEBUG = {
    request,
    version,
  };
}
